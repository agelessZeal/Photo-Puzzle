let _, async, mongoose, BaseController, View;
let config, axios, request, fs, jimp, admZip;
let UserModel;

let nodemailer, ejs, transporter;

async = require("async");
mongoose = require('mongoose');
axios = require('axios');
config = require('../config/index');
fs = require('fs');

jimp = require('jimp');  //https://www.npmjs.com/package/jimp

UserModel = require('../models/user');
BaseController = require('./BaseController');
View = require('../views/base');

request = require('request');

nodemailer = require('nodemailer');
ejs = require('ejs');

admZip = require('adm-zip');// https://www.npmjs.com/package/adm-zip

transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: config.node_mail.mail_account,
        pass: config.node_mail.password
    }
});

module.exports = BaseController.extend({
    name: 'HomeController',
    run: async function (req, res) {
        await this.config();///Make Demo Database...
        let v;
        v = new View(res, 'frontend/home/index');
        let premiumSt = false;
        if (this.isLogin(req)){
            let plan = req.session.user.stripe.plan ;
            if( plan == 'Monthly' || plan== 'Annually') {
                premiumSt = true;
            }
        }

        v.render({
            title: 'Home',
            confirm_account: req.flash('confirm_account'),
            session: req.session,
            premium_st: premiumSt,
            error: req.flash('error'),
            success: req.flash('success'),
        });
    },

    showPrices: async function (req, res) {
        let v;
        v = new View(res, 'frontend/home/price');
        let curPlan = 'Monthly';
        if (this.isLogin(req)) {
            if(req.session.user.stripe.plan == 'Monthly' || req.session.user.stripe.plan == 'Annually' ){
                curPlan = req.session.user.stripe.plan;
            }
        }
        v.render({
            title: 'Prices',
            session: req.session,
            cur_plan: curPlan,
            error: req.flash('plan_error'),
            success: req.flash('plan_success'),
        });
    },

    makeGrids: function (w, h, gridX, gridY) {

        console.log(w, h, gridX, gridY);

        let xGridW = Math.floor(w / gridX);
        let yGridH = Math.floor(h / gridY);

        let spaceW = w;
        let spaceH = h;

        let gridListX = [];
        let gridListY = [];
        let gridBoxList = [];
        let i, j;
        for (let i = 0; i < gridX; i++) {
            if (spaceW >= xGridW) {
                if (spaceW < 2 * xGridW) {
                    gridListX.push(spaceW);
                } else {
                    gridListX.push(xGridW);
                }
                spaceW -= xGridW;
            }
        }
        for (let j = 0; j < gridY; j++) {
            if (spaceH >= yGridH) {
                if (spaceH < 2 * yGridH) {
                    gridListY.push(spaceH);
                } else {
                    gridListY.push(yGridH);
                }
                spaceH -= yGridH;
            }
        }

        let posy = 0;
        for (j = 0; j < gridY; j++) {
            let posx = 0;
            posy += gridListY[j];
            for (i = 0; i < gridX; i++) {
                posx += gridListX[i];
                gridBoxList.push({
                    posx: posx - gridListX[i],
                    posy: posy - gridListY[j],
                    w: gridListX[i],
                    h: gridListY[j]
                })
            }
        }

        return {
            xLines: gridListX,
            yLines: gridListY,
            gridBox: this.shuffle(gridBoxList)
        };

    },

    viewDownloadImage: async function (req, res) {

        let downloadOption = req.session.downloadOption;
        let self = this;
        if (downloadOption) {
            console.log('Download Image.....');
            console.log(downloadOption);

            let gridSize = config.grid_sizes[downloadOption.grid];
            console.log(gridSize);

            let srcImgPath = downloadOption.path;
            let gridX = gridSize.w;
            let gridY = gridSize.h;
            let coverColor = downloadOption.color;
            let fn = downloadOption.fn;
            let coverImage = downloadOption.cover;

            let srcImg = await jimp.read(srcImgPath);
            let srcW = srcImg.bitmap.width; //  width of the image
            let srcH = srcImg.bitmap.height; // height of the image

            let gridData = this.makeGrids(srcW, srcH, gridX, gridY);

            let gridBoxList = gridData.gridBox;
            let xLines = gridData.xLines;
            let yLines = gridData.yLines;

            let retImgList = [];
            //Create Cover BackgroundImage

            let autoStr = '';
            let i = 0;
            for (i = 0; i < gridX; i++) {
                autoStr += 'auto '
            }

            let tileMaker = function (err, image) {
                if (err) {
                    console.log("Can't make image tiles!");
                    req.flash('error', 'Can\'t make image tiles!');
                    return res.redirect('/')
                }
                // this image is srcW x srcH, every pixel is set to 0x00ff00ff
                let prevPosx = 0;
                let prevPosy = 0;
                for (let x = 0; x < xLines.length - 1; x++) {
                    prevPosx += xLines[x];
                    self.drawLine(image, prevPosx, 0, prevPosx, srcH)
                }

                for (let y = 0; y < yLines.length - 1; y++) {
                    prevPosy += yLines[y];
                    self.drawLine(image, 0, prevPosy, srcW, prevPosy)
                }

                let tilePath = `/uploads/gen/${fn}-0.jpg`;
                image.write(`public${tilePath}`);
                retImgList.push(tilePath);
                for (i = 1; i < gridBoxList.length; i++) {
                    let cloneImg = srcImg.clone();
                    console.log(gridBoxList[i].posx, gridBoxList[i].posy, gridBoxList[i].w, gridBoxList[i].h);
                    tilePath = `/uploads/gen/${fn}-${i}.jpg`;
                    cloneImg.crop(gridBoxList[i].posx, gridBoxList[i].posy, gridBoxList[i].w, gridBoxList[i].h);
                    image.blit(cloneImg, gridBoxList[i].posx, gridBoxList[i].posy);
                    image.write(`public${tilePath}`);
                    retImgList.push(tilePath);
                }
                console.log('done-------');

                srcImgPath = srcImgPath.substr(6);
                retImgList.push(srcImgPath);

                let v;
                v = new View(res, 'frontend/home/download');
                v.render({
                    title: 'Download',
                    img_list: retImgList,
                    auto_str: autoStr.trim(),
                    session: req.session,
                });
            };

            if (coverImage != '') {
                return new jimp(coverImage, tileMaker);
            } else {
                return new jimp(srcW, srcH, coverColor, tileMaker);
            }

        } else {
            return res.redirect('/*');
        }
    },

    drawLine: function (img, x1, y1, x2, y2) {

        let white = jimp.rgbaToInt(255, 255, 255, 180);
        for (let x = x1; x <= x2; x++) {
            for (let y = y1; y <= y2; y++) {
                img.setPixelColor(white, x, y);
            }
        }
    },

    generateQuizImages: async function (req, res) {
        let imgType = req.body.imageType;//imgType : avatar
        if(req.files) {
            let upload_file = req.files.file;
            let fn = upload_file.name;
            let ext = fn.substr(fn.lastIndexOf('.') + 1).toLowerCase();
            if (ext == 'blob') ext = 'png';
            let imgId = this.makeID(30);
            let dest_fn = `${imgId}.${ext}`;
            fn = fn.substr(0, fn.lastIndexOf('.'));
            let fPath = `public/uploads/${imgType}/${dest_fn}`;
            let self = this;
            upload_file.mv(fPath, async function (err) {
                if (err) {
                    console.log('File Uploading Error');
                    req.flash('error', 'File Uploading Error');
                    return res.redirect('/');
                }
                //Check Image Size
                let srcImg = await jimp.read(fPath);
                let srcW = srcImg.bitmap.width; //  width of the image
                let srcH = srcImg.bitmap.height; // height of the image
                // Cover Image upload
                let cover_file = req.files.cover_img;
                if (cover_file) {
                    let cover_fn = cover_file.name;
                    let cover_ext = cover_fn.substr(cover_fn.lastIndexOf('.') + 1).toLowerCase();
                    if (cover_ext == 'blob') cover_ext = 'png';
                    let cover_imgId = self.makeID(30);
                    let cover_dest_fn = `${cover_imgId}.${cover_ext}`;
                    let cover_fPath = `public/uploads/${imgType}/${cover_dest_fn}`;
                    cover_file.mv(cover_fPath, async function (err) {
                        if (err) {
                            console.log('Cover Image File Uploading Error');
                            req.flash('error', 'Cover Image File Uploading Error');
                            return res.redirect('/');
                        }
                        //Check Image Size
                        let coverImage = await jimp.read(cover_fPath);
                        let coverImgW = coverImage.bitmap.width; //  width of the image
                        let coverImgH = coverImage.bitmap.height; // height of the image
                        if(coverImgW == srcW && coverImgH == srcH) {
                            req.session.downloadOption = {path: fPath, fn: fn, grid: req.body.gridSize, color: req.body.coverColor, cover:cover_fPath};
                            await req.session.save();
                            return res.redirect(`/download-images`);
                        } else {
                            req.flash('error', `Cover Image size should be matched with source image!`);
                            return res.redirect('/');
                        }
                    });
                } else {
                    req.session.downloadOption = {path: fPath, fn: fn, grid: req.body.gridSize, color: req.body.coverColor, cover:''};
                    await req.session.save();
                    return res.redirect(`/download-images`);
                }
            });
        } else {
            req.flash('error', `Please upload Image file again!`);
            return res.redirect('/');
        }
    },

    downloadImages: async function (req, res) {

        let imgList = req.body.imgList;
        let fName = req.body.fname;
        let ret = {
            status: 'fail',
            data: ''
        };

        let zipPath = `/uploads/downloads/${fName}.zip`;
        let zip = new admZip();
        for (let i = 0; i < imgList.length; i++) {
            zip.addLocalFile(`public${imgList[i]}`);
        }
        zip.writeZip(`public${zipPath}`);

        ret.status = 'success';
        ret.data = zipPath;
        return res.json(ret);

    },

    uploadImage: async function (req, res) {
        if (!this.isLogin(req)) {
            return res.json({status: 'fail', data: 'Login Session Expired'});
        }
        let filePaths = [];
        let imgType = req.body.img_type;//imgType : avatar,category
        let upload_file = req.files.file;
        let fn = upload_file.name;
        let ext = fn.substr(fn.lastIndexOf('.') + 1).toLowerCase();
        if (ext == 'blob') ext = 'png';
        let dest_fn = this.makeID(imgType + "-", 10) + "." + ext;
        upload_file.mv('public/uploads/' + imgType + '/' + dest_fn, async function (err) {
            if (err) {
                console.log('File Uploading Error');
                return res.json({status: 'fail', data: 'Watch Image Uploading Error'});
            }
            filePaths.push("uploads/" + imgType + "/" + dest_fn);
            return res.json({status: 'success', data: filePaths});
        });
    },

    config: async function () {
        ///Add Admin
        let adminInfo = await UserModel.findOne({role: 'admin'});
        if (adminInfo == null) {
            adminInfo = new UserModel({
                "user_id": "user_BuUbruAfUe",
                "username": "admin",
                "email": "admin@gmail.com",
                "password": "02a05c6e278d3e19afaca4f3f7cf47d9", /// Password is "qqqqqqq"
                "createdAt": new Date("2019-04-25T16:08:51.667Z"),
                "role": "admin",
                "active": true,
                "token": "",
            });
            await adminInfo.save();
        }
    }
});
