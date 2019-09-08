let _, async, mongoose, BaseController, View, path;
let config, axios, request, fs, ejs;
let UserModel;

async = require("async");
mongoose = require('mongoose');
axios = require('axios');
path = require('path');
config = require('../config/index');
fs = require('fs');
ejs = require('ejs');

UserModel = require('../models/user');

BaseController = require('./BaseController');
View = require('../views/base');
request = require('request');

module.exports = BaseController.extend({
    name: 'DashboardController',
    listUsers: async function (req, res) {
    },
    editUser: async function (req, res) {
    },
    deleteUser: async function (req, res) {
    },
});
