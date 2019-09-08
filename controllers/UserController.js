let _, async, mongoose, BaseController;
let config, axios, request, fs, ejs, crypto, nodemailer, transporter, View;
let UserModel;

async = require("async");
mongoose = require('mongoose');
axios = require('axios');
config = require('../config/index');
fs = require('fs');
crypto = require('crypto');
request = require('request');
nodemailer = require('nodemailer');
ejs = require('ejs');
UserModel = require('../models/user');

BaseController = require('./BaseController');
View = require('../views/base');

transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: config.node_mail.mail_account,
        pass: config.node_mail.password
    }
});


module.exports = BaseController.extend({
    name: 'UserController',
    accountSetting: async function (req, res) {
        if (!this.isLogin(req)) {
            return res.redirect('/auth/login');
        }
        let v = new View(res, 'frontend/user/index');
        v.render({
            title: 'Account Setting',
            session: req.session,
            pub_key: config.stripeOptions.stripePubKey,

            acc_error: req.flash("acc_error"),
            acc_success: req.flash("acc_success"),

            addr_error: req.flash("addr_error"),
            addr_success: req.flash("addr_success"),

            plan_error: req.flash("plan_error"),
            plan_success: req.flash("plan_success"),
        })
    },

    updateUser: async function (req, res) {
        if (!this.isLogin(req)) {
            return res.redirect('/auth/login');
        }
        let backURL = '/account-setting';
        let userInfo = await UserModel.findOne({email: req.session.user.email});
        userInfo.fname = req.body.fname;
        userInfo.sname = req.body.sname;

        if (req.body.password != '' || req.body.confirm_password != '') {
            if (req.body.password != req.body.confirm_password) {
                req.flash('acc_error', 'Confirm password does not match');
                return res.redirect(backURL+ '#account');
            } else {
                userInfo.password = crypto.createHash('md5').update(req.body.password).digest("hex");
            }
        }
        await userInfo.save();
        req.flash('acc_success', 'Account Details Saved Successfully');
        req.session.user = userInfo;

        return res.redirect(backURL + '#account');

    },

    updateAddress: async function (req, res) {
        if (!this.isLogin(req)) {
            return res.redirect('/auth/login');
        }
        let backURL = '/account-setting';
        let userInfo = await UserModel.findOne({email: req.session.user.email});

        userInfo.company = req.body.company;
        userInfo.street = req.body.street;
        userInfo.city = req.body.street;
        userInfo.postalCode = req.body.postalCode;
        userInfo.country = req.body.country;

        await userInfo.save();

        req.flash('addr_success', 'Address Saved Successfully');
        req.session.user = userInfo;
        return res.redirect(backURL + '#address');
    },

    updatePlan: async function (req, res) {

        if (!this.isLogin(req)) {
            return res.redirect('/auth/login');
        }

        let plan = req.body.plan;
        let stripeToken = null;
        let backURL = req.headers.referer || '/account-setting';

        if (req.session.user.stripe.plan == plan) {
            req.flash('plan_success', 'The selected plan is the same as the current plan.');
            return res.redirect(backURL + '#plan');
        }

        if (req.body.stripeToken) {
            stripeToken = req.body.stripeToken;
        }

        console.log(req.session.user.stripe);

        if (!req.session.user.stripe.last4 && !req.body.stripeToken) {
            console.log('===================================================================');
            console.log(req.session.user.stripe.last4);
            req.flash('plan_error', 'Please add a card to your account before choosing a plan.');
            return res.redirect(backURL + '#plan');
        }

        UserModel.findOne({email: req.session.user.email}, function (err, user) {
            if (err) {
                req.flash('plan_error', 'Something went wrong!');
                console.log(err);
                return res.redirect(backURL + '#plan');
            }

            user.setPlan(plan, stripeToken, async function (err) {
                let msg;
                if (err) {
                    if (err.code && err.code == 'card_declined') {
                        msg = 'Your card was declined.  Please provide a valid card.';
                    } else if (err && err.message) {
                        msg = err.message;
                    } else {
                        msg = 'An unexpected error occurred.';
                    }

                    req.flash('plan_error', msg);
                    return res.redirect(backURL + '#plan');
                }
                req.flash('plan_success', 'Changed plan successfully');
                req.session.user.stripe.plan = plan;
                await req.session.save();
                return res.redirect(backURL + '#plan');
            });
        });
    },

    cancelPlanDelete: async function (req, res) {
        if (!this.isLogin(req)) {
            return res.redirect('/');
        }
        UserModel.findOne({email: req.session.user.email}, async function (err, user) {
            if (err) {
                console.log(err);
                req.flash('plan_error', 'Something went wrong!');
                return res.redirect('/account-setting#plan');
            }

            user.cancelStripe(async function (err) {
                if (err) {
                    console.log(err);
                    req.flash('plan_error', 'Something went wrong!');
                    return res.redirect('/account-setting#plan');
                }
                req.flash('plan_success', 'Your subscription has been successfully canceled. You will not be charged anymore.\n' +
                    '                            You can re-subscribe at anytime.');
                req.session.user.stripe.plan = '';
                await req.session.save();
                user.stripe.plan = '';
                await user.save();
                res.redirect('/account-setting#plan');
            });
        });
    },

    cancelPlan: async function (req, res) {
        if (!this.isLogin(req)) {
            return res.redirect('/');
        }
        let backURL = '/account-setting#plan';
        UserModel.findOne({email: req.session.user.email}, async function (err, user) {
            if (err) {
                console.log(err);
                req.flash('plan_error', 'Something went wrong!');
                return res.redirect('/account-setting#plan');
            }
            user.setPlan('Free', '', async function (err) {
                if (err) {
                    console.log(err);
                    req.flash('plan_error', 'Something went wrong');
                    return res.redirect(backURL);
                }
                req.flash('plan_success', 'Your subscription has been successfully canceled. You will not be charged anymore.\n' +
                    '                            You can re-subscribe at anytime.');
                req.session.user.stripe.plan = 'Free';
                await req.session.save();
                return res.redirect(backURL);
            });
        });
    },

    uploadAvatar: async function (req, res) {
        let upload_file, fn, ext, dest_fn, user_id, user_info;
        user_id = req.body.user_id;
        user_info = await UserModel.findOne({user_id: user_id});
        upload_file = req.files.file;
        fn = upload_file.name;
        ext = fn.substr(fn.lastIndexOf('.') + 1).toLowerCase();
        if (ext == 'blob') ext = 'png';
        dest_fn = this.makeID('avatar_', 10) + "." + ext;
        upload_file.mv('public/uploads/avatar/' + dest_fn, async function (err) {
            if (err) {
                console.log('File Uploading Error');
                console.log(err);
                return res.send({status: 'fail', data: 'Avatar Image Uploading Error'});
            }
            if (user_info != null) {
                user_info.avatar = 'uploads/avatar/' + dest_fn;
                user_info.save();
            }
            return res.send({status: 'success', data: '/uploads/avatar/' + dest_fn});
        });
    },
});
