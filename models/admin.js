/**
 * Model schema for the admin data to be stored in database
 */
const mongoose =  require('mongoose');

const Admin = mongoose.model('Admin',new mongoose.Schema({
    name:{
        type:String,
        required: false,
        minlenght: 4,
        maxlenght: 50
    },
    email:{
        type:String,
        required:true,
        minlenght:5,
        maxlenght:255,
        unquie:true
    },
    password:{
        type: String,
        required: true,
        minlenght:5,
        maxlenght: 1024
    },
    confirm_password:{
        type: String,
        required: false,
        minlenght:5,
        maxlenght: 1024
    },
    phone_number:{
        type: Number,
        required: true,
        minlenght:10,
        maxlenght: 13
    }
}
));

exports.Admin = Admin;
