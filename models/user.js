const mongoose =  require('mongoose');

//mongoose schema of collection: user
const User = mongoose.model('User',new mongoose.Schema({
    firstName:{
        type:String,
        required: false,
        minlenght: 2,
        maxlenght: 50
    },
    lastName:{
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
    country:{
        type:String,
        required: false,
        minlenght: 4,
        maxlenght: 65
    },
    phone_number:{
        type: Number,
        required: true,
        minlenght:10,
        maxlenght: 13
    },
    gender:{
        type:String,
        required: false,
        minlenght: 4,
        maxlenght: 10
    },
    address: {
        type:String,
        required: false,
        minlenght: 4,
        maxlenght: 255
    },
    isMailVerified: {
        type:Boolean,
        default:false
    },
    token:{
        type:String,
        required:false
    }
}
));

exports.User = User;
