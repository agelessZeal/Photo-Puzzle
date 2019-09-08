let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let stripeCustomer = require('./stripe-customer');
let config = require('../config/index');

let UserSchema = new Schema({
    user_id:String,
    email:String,
    password:String,
    fname: String,
    sname: String,
    avatar:String,

    company: String,
    street: String,
    city: String,
    postalCode: String,
    country: String,

    createdAt:Date,  //Time Stamp,
    role:String,
    active:Boolean,
    token:String,//Password Reset Token
});

UserSchema.plugin(stripeCustomer, config.stripeOptions);

module.exports = mongoose.model('user', UserSchema);
