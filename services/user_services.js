/**
 * requiremnt for user services
 */

const bycrypt = require('bcrypt');
const _ = require('lodash');
const {User} = require('../models/user');
const jwt = require('jsonwebtoken');
const { v4} = require('uuid');
const mail = require('../utils/mail');



/**
 * Service function for user login
 * @param {JSON} req Request body containing user fields
 * @param {string} res response to be passed to controller
 * @returns status code, message and authentication token
 */

const userSignUp = async (req,res) => {
    try{
        let user = await User.findOne({email: req.email});
        if(user){
            return [403,'User already registered!']
        }else{
            user = new User(_.pick(req,['firstName','lastName','email','password','country','phone_number','gender','address','isMailVerified','token']));
            const salt = await bycrypt.genSalt(10);
            user.password = await bycrypt.hash(user.password,salt);
            await user.save();
            let email = user.email;
            var token = v4();
            if(token){
              await User.updateOne({email:email},{$set :{token :token}});
              mail.verifyMail(email,`your token is ${token}`);
              const payload = {_id:user._id,email:user.email,firstName:user.firstName};
              const authToken = jwt.sign(payload, process.env.SECRET_TOK, { expiresIn: 10000 }, { algorithm: 'SHA256'});
              let data  = {
                "message":"verification token has been send to your registered mail id.",
                "x-auth":authToken
            }
            return [200,data,res];
            }           
        }
    }catch(e){
        return [403,e,res]
    }
}


/**
 * Service function for user login
 * @param {JSON} req Request bodu containing the login credentials of user
 * @param {string} res Response to be passed to controller
 * @returns status code, message and authentication token
 */

const userLogin = async (req,res) => {
    let user = await User.findOne({email:req.email});
    try{
        if(!user){
            return [403,'Incorrct email or password!',res]
        }
    const validPass =  await bycrypt.compare(req.password,user.password);
    if(!validPass){
        return [403,'Incorrct email or password!',res];
    }
    const payload = {_id:user._id,email:user.email,firstName:user.firstName,lastName:user.lastName};
    const authToken = jwt.sign(payload, process.env.SECRET_TOK, { expiresIn: 10000 }, { algorithm: 'SHA256'});
    if(user.isMailVerified === false){
        let data = {
            "x-auth":authToken,
            "message":"Login successful.",
            "warning":"Email verification incomplete."
        }
        return [200,data,res]
    }else{
        let data = {
            "x-auth":authToken,
            "message":"Login successful.",
        }
        return [200,data,res]
    }       
    }catch(e){
        return [403,e,res]
    }
}


/**
 * Service function for email verification
 * @param {string} req  Request parameter containing user id and verification token
 * @param {string} res response to be passed to controller
 * @returns status code, message indicating progress of email verification
 */

const userMailVerify = async (req,res) =>{
    try{
        let id = req.params.userId;
        let currentToken = req.params.token;
        const query = { _id: id };
        let user = await User.findOne(query);
        let validToken = user.token;
        if(currentToken === validToken){
            await User.updateOne({_id:id},{$set:{isMailVerified:true}})
            return [200,'email verified',res]
        }else{
            return [403,'Invalid Token',res]
        }
    }catch(e){
        return [403,e,res]
    }
}


/**
 * Service function for Password Reset initiation
 * @param {JSON} req Request body containing the mail id whose password is to be reseted
 * @param {string} res Response to be passed to the controller
 * @returns status code and message indicating progress of reset
 */

const resetPass = async (req,res) =>{
    try{
        let email = req.email;
        let user = await User.findOne({email:email});
        if(!user){
            return res.status(400).send('Email is not registered');
        }else{
            var token = v4();
            if(token){
                await User.updateOne({email:email},{$set :{token :token}});
                mail.resetMail(email,`your reset password token is ${token}`);
            }
            return [200,"reset token has been sent to your registered email.",res]
        }
    }catch(e){
        return [403,e,res]
    };
}


/**
 * Service function for Updating new password
 * @param {JSON} req request body containing the new password, email id and rest token
 * @param {string} res response to be passed to controller
 * @returns status code and message indicating process of updation 
 */

const newPass = async (req,res) =>{
    let email = req.email;
    let resetToken = req.resetToken;
    let newPass = req.password;
    const query = { email: email };
    let user = await User.findOne(query);
    let validToken = user.token;
    if(resetToken === validToken){
        const salt = await bycrypt.genSalt(10);
        const password = await bycrypt.hash(newPass,salt);
        await User.updateOne({email:email},{$set:{password:password}});
        return [200,'Password has been reset',res]
    }else{
        return [403,'Invalid reset Token',res]
    }
}


/**
 * Service function for User dashboard via JWT based authentication
 * @param {string} req Request header with JWT token for authentication
 * @param {string} res Response to passed to controller
 * @returns status code and User dashboard contents
 */

const userDashboard = async (req,res) => { 
    try{
        let data = {
            data:{
                title:"User Dashboard",
                user:req.data.firstName,
                details:req.data,
                message:"User Content"
            }
        }
        return [200,data,res]
    }catch(e){
        return [403,'Invalid token']
    }
    }


    

module.exports = {
    userLogin,userSignUp,userMailVerify,resetPass,newPass,userDashboard
}