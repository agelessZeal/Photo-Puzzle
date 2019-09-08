let express, router, config;
let home_controller, user_controller,
    error_controller, auth_controller,
    admin_controller;

express = require('express');
router = express.Router();
config = require('./config/index');

user_controller = require('./controllers/UserController');
error_controller = require('./controllers/ErrorController');
auth_controller = require('./controllers/AuthController');
admin_controller = require('./controllers/AdminController');
home_controller = require('./controllers/HomeController');

/**
 * Frontend Routers
 */
//////////////////////////////////////Site map/////////////////////////////
router.get('/', function (req, res) {
    home_controller.run(req, res);
});

router.get('/prices', function (req, res) {
    home_controller.showPrices(req, res);
});

router.post('/generate-quiz-images', function (req, res) {
    home_controller.generateQuizImages(req, res);
});

router.get('/download-images', function (req, res) {
    home_controller.viewDownloadImage(req, res);
});

router.post('/download-images', function (req, res) {
    home_controller.downloadImages(req, res);
});

/******************************************************************
 *                  User Controller                               /
 ******************************************************************/
router.get('/account-setting', function (req, res) {
    user_controller.accountSetting(req, res);
});

router.post('/user/update/details', function (req, res) {
    user_controller.updateUser(req, res);
});

router.post('/user/update/address', function (req, res) {
    user_controller.updateAddress(req, res);
});

router.post('/user/update/plan', function (req, res) {
    user_controller.updatePlan(req, res);
});

router.get('/user/update/cancel-plan', function (req, res) {
    user_controller.cancelPlan(req, res);
});

/******************************************************************
 *                  Auth Controller                               /
 ******************************************************************/
router.get('/auth/login', function (req, res) {
    auth_controller.login(req, res);
});
router.post('/auth/login', function (req, res) {
    auth_controller.loginUser(req, res);
});

router.get('/auth/logout', function (req, res) {
    auth_controller.logout(req, res);
});

router.get('/auth/register', function (req, res) {
    auth_controller.register(req, res);
});

router.post('/auth/register', function (req, res) {
    auth_controller.createUser(req, res);
});

router.get('/thank-you', function (req, res) {
    auth_controller.doneCreateUser(req, res);
});

router.get('/auth/forgot-password', function (req, res) {
    auth_controller.forgotPassword(req, res);
});

router.get('/confirm_account', function (req, res, next) {
    auth_controller.confirmAccount(req, res, next);
});

router.post('/auth/reset_password', function (req, res, next) {
    auth_controller.reset_password(req, res, next);
});

router.get('/password/reset/:token', function (req, res, next) {
    auth_controller.show_password_change(req, res, next);
});

router.post('/password/reset', function (req, res, next) {
    auth_controller.password_change(req, res, next);
});

/******************************************************************
 *                  Dashboard Controller                           /
 ******************************************************************/
router.get('/admin/users', function (req, res) {
    admin_controller.listUsers(req, res);
});

router.get('/admin/users/:userId', function (req, res) {
    admin_controller.editUser(req, res);
});

router.get('/admin/users/delete/:userId', function (req, res) {
    admin_controller.deleteUser(req, res);
});

router.post('/admin/users/update/:userId', function (req, res) {
    user_controller.updateUser(req, res);
});

router.post('/users/update/:userId', function (req, res) {
    user_controller.updateUser(req, res);
});

router.post('/users/upload_avatar', function (req, res) {
    user_controller.uploadAvatar(req, res);
});

/**
 * Setting Controller
 */

router.get('*', function (req, res) {
    error_controller.show_404(req, res);
});

module.exports = router;
