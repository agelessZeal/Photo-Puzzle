let _, async, mongoose, BaseController;
let config, axios, request, fs, crypto, ejs,
    nodemailer, transporter;
let UserModel, View;

async = require("async");
mongoose = require('mongoose');
axios = require('axios');
crypto = require('crypto');
nodemailer = require('nodemailer');
request = require('request');
config = require('../config/index');
fs = require('fs');
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

let d = new Date();

module.exports = BaseController.extend({
    name: 'AuthController',
    login: async function (req, res) {
        let v;
        v = new View(res, 'auth/login');
        v.render({
            title: 'Sign In',
            session: req.session,
            error: req.flash("error"),
            success: req.flash("success"),
        });
    },
    register: async function (req, res) {
        let v;
        if (this.isLogin(req)) {
            return res.redirect('/');
        }
        let plan = 'Monthly';
        if(req.query.plan) {
            if (req.query.plan == 'Annually' || req.query.plan == 'Monthly') {
                plan = req.query.plan;
            }
        }

        v = new View(res, 'auth/register');
        v.render({
            title: 'Sign Up',
            session: req.session,
            pub_key: config.stripeOptions.stripePubKey,
            cur_plan: plan,
            error: req.flash("error"),
            success: req.flash("success"),
        })
    },
    doneCreateUser: async function (req, res) {
        let v;
        if (req.session.done_subscription) {
            req.session.done_subscription = false;
            req.session.save();
            v = new View(res, 'auth/thank_you');
            v.render({
                title: 'All Done',
                session: req.session,
            })
        } else {
            if (this.isLogin(req)) {
                 res.redirect('/')
            } else {
                res.redirect('/auth/register');
            }
        }

    },
    loginUser: async function (req, res) {
        let password = crypto.createHash('md5').update(req.body.password).digest("hex");
        let userInfo = await UserModel.findOne({email: req.body.email, password: password});
        if (userInfo == null) {
            req.flash('error', 'Incorrect email or password.');
            return res.redirect('/auth/login');
        }
        if (!userInfo.active) {
            console.log('Please confirm your e-mail address in your inbox before logging in');
            req.flash('error', 'Please confirm your e-mail address in your inbox before logging in');
            return res.redirect('/auth/login');
        }
        req.session.login = true;
        req.session.user = userInfo;
        return res.redirect('/');
    },

    createUser: async function (req, res) {
        //check validation
        let backURL = req.headers.referer;
        let email = req.body.email.trim();
        let password = req.body.password;
        let plan = req.body.plan;
        let stripeToken = null;

        if (!this.isEmail(email)) {
            req.flash('error', 'Invalid Email address!');
            return res.redirect(backURL);
        }

        if (password.length == 0) {
            req.flash('error', 'Empty password');
            return res.redirect(backURL);
        }

        let prevUserByEmail = await UserModel.findOne({email: email});
        if (prevUserByEmail != null) {
            req.flash('error', 'The Email has already been used by someone');
            return res.redirect(backURL);
        }

        if (!req.body.stripeToken) {
            req.flash('error', 'Please provide a valid card.');
            return res.redirect(backURL);
        }
        stripeToken = req.body.stripeToken;


        password = crypto.createHash('md5').update(password).digest("hex");
        let that = this;
        let token = that.makeID('', 30);
        let userInfo = new UserModel({
            "user_id": that.makeID('U', 10),
            "email": email,
            "password": password,
            "createdAt": new Date(),
            "role": "user",
            "active": true,
            "token": token,
        });
        await userInfo.save();

        console.log('Setting billing address by card info');
        userInfo.setPlan(plan, stripeToken, function (err) {
            let msg;
            if (err) {
                if (err.code && err.code == 'card_declined') {
                    msg = 'Your card was declined. Please provide a valid card.';
                } else if (err && err.message) {
                    msg = err.message;
                } else {
                    msg = 'An unexpected error occurred.';
                }
                console.log('Setting Subscription Plan ============> Error');
                req.flash('error', msg);
                return res.redirect(backURL);
            }
            console.log('Setting Subscription Plan =========> Success');

            userInfo.stripe = {plan: plan};
            req.session.user = userInfo;
            req.session.login = true;
            req.session.done_subscription = true;
            req.session.save();
            res.redirect('/thank-you');
        });
    },

    confirmAccount: async function (req, res) {
        let token, user, backURL;
        backURL = req.query.redirect_url;
        token = req.query.token;
        if (this.isLogin(req)) {
            return res.redirect('/');
        }
        user = await UserModel.findOne({token: token});
        if (user == null) {
            req.flash('confirm_account', "Token has been expired&fail");
            return res.redirect(backURL);
        } else {
            if (token == user.token) {
                user.active = true;
                user.token = '';
                await user.save();
                req.flash('confirm_account', "Email confirmed successfully&success");
                return res.redirect(backURL);
            } else {
                req.flash('confirm_account', "Invalid Token&fail");
                return res.redirect(backURL);
            }
        }
    },

    logout: async function (req, res) {
        req.session.login = false;
        req.session.user = null;
        req.session.save();
        return res.redirect('/');
    },
    forgotPassword: async function (req, res) {
        let v;
        if (this.isLogin(req)) {
            return res.redirect('/');
        }
        v = new View(res, 'auth/forgot-password');
        v.render({
            title: 'Forgot Password',
            session: req.session,
            error: req.flash("error"),
            success: req.flash("success"),
        })
    },
    // reset password
    reset_password: async function (req, res, next) {
        let email, userinfo;
        email = req.body.email;
        userinfo = await UserModel.findOne({email: email});
        if (userinfo == null) {
            req.flash('error', 'Can not find your email.');
            return res.redirect('/auth/forgot-password');
        } else {
            let token = this.makeID('BezelHeads-', 20);
            let confirmURL = config.info.site_url + 'password/reset/' + token;
            userinfo.token = token;
            userinfo.save(async function (err, data) {
                if (err) {
                    console.log(err);
                } else {
                    ejs.renderFile("views/email/reset-password.ejs",
                        {
                            site_url: config.info.site_url,
                            confirm_url: confirmURL,
                            site_name: config.info.site_name
                        },
                        function (err, data) {
                            if (err) {
                                console.log(err);
                                req.flash('error', 'Please check Provider Email');
                                return res.redirect('/auth/forgot-password');
                            } else {
                                var mailOptions = {
                                    from: config.node_mail.mail_account, // sender address
                                    to: email, // list of receivers
                                    subject: '[' + config.info.site_name + ']Please reset your password', // Subject line
                                    text: 'BezelHeads ✔', // plaintext body
                                    html: data // html body
                                };
                                // send mail with defined transport object
                                transporter.sendMail(mailOptions, function (error, info) {
                                    if (error) {
                                        console.log(error);
                                        req.flash('error', 'Please check Provider Email');
                                        return res.redirect('/auth/forgot-password');
                                    } else {
                                        console.log('Message sent: ' + info.response);
                                        console.log('[' + d.toLocaleString() + '] ' + email + '\'message has been sent successfully');
                                        req.flash('success', 'Check your email for a link to reset your password. If it doesn’t appear within a few minutes, check your spam folder.');
                                        return res.redirect('/auth/forgot-password');
                                    }
                                });
                            }
                        });
                }
            });

        }
    },
    show_password_change: async function (req, res, next) {
        let token, userinfo;
        token = req.params.token;
        userinfo = await UserModel.findOne({token: token});
        if (userinfo != null) {
            var v = new View(res, 'auth/change-password');
            v.render({
                token: token,
                username: userinfo.username,
                session: req.session,
                error: req.flash("error"),
                success: req.flash("success"),
                title: 'Change Password'
            });
        } else {
            return res.redirect('/auth/login');
        }
    },

    password_change: async function (req, res, next) {
        let token, userinfo, new_pass, confirm_pass;
        token = req.body.token;
        userinfo = await UserModel.findOne({token: token});
        if (userinfo != null) {
            new_pass = req.body.new_password;
            confirm_pass = req.body.confirm_password;
            if (new_pass != confirm_pass) {
                req.flash('error', 'Confirm Password doesn\'t match!');
                return res.redirect('/password/reset/' + token);
            } else if (new_pass.length < 6) {
                req.flash('error', 'Password should be at least 6 characters');
                return res.redirect('/password/reset/' + token);
            } else {
                userinfo.password = crypto.createHash('md5').update(new_pass).digest("hex");
                userinfo.token = "";
                await userinfo.save();
                req.flash("success", 'New password set successfully.');
                return res.redirect('/auth/login');
            }

        } else {
            req.flash('error', 'User doesn\'t exist!');
            return res.redirect('/password/reset/' + token);
        }
    },

    checkPasswordValidation: function (pwd, confirm_pwd) {
        let ret = {
            st: false,
            msg: ""
        };
        if (pwd.trim().length < 6) {
            ret.msg = "The password must be at least 6 characters.";
            return ret;
        }
        if (pwd != confirm_pwd) {
            ret.msg = "The password confirmation does not match";
            return ret;
        }
        ret.st = true;
        return ret;

    }
});
