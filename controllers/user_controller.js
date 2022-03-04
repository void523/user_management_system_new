const bycrypt = require('bcrypt');
const _ = require('lodash');
const {User} = require('../models/user');
const jwt = require('jsonwebtoken');
const { v4} = require('uuid');
const validation = require('../validate');
const mail = require('../utils/mail');

exports.signUp = async(req,res)=>{
    const {error} = validation.validateUserSignUp(req.body);
    if(error){
      return res.status(400).send(error.details[0].message);
    }
    let user = await User.findOne({email: req.body.email});
    if(user){
      return res.status(400).send("That user already exists");
    }else{
      user = new User(_.pick(req.body,['firstName','lastName','email','password','country','phone_number','gender','address','isMailVerified','token']));
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
        res.status(200).json({
            data:{
                "message":"verification token has been send to your registered mail id.",
                "x-auth":authToken
            }
        });
        }
    }
  };


exports.login =  async(req,res)=>{
    const {error} = validation.loginValidation(req.body);
    if(error){
        return res.status(400).send(error.details[0].message);
    }
    let user = await User.findOne({email:req.body.email});
    if(!user){
        return res.status(400).send('Incorrct email or password');
    }
    const validPass =  await bycrypt.compare(req.body.password,user.password);
    if(!validPass){
        return res.status(400).send('Incorrect email or password');
    }
    const payload = {_id:user._id,email:user.email,firstName:user.firstName,lastName:user.lastName};
    const authToken = jwt.sign(payload, process.env.SECRET_TOK, { expiresIn: 10000 }, { algorithm: 'SHA256'});
    if(user.isMailVerified === false){
        res.status(200).json({
            data:{
                "x-auth":authToken,
                "message":"Login successful.",
                "warning":"Email verification incomplete."
            }
        });
    }else{
        res.status(200).json({
            data:{
                "x-auth":authToken,
                "message":"Login successful"
            }
        });
    }
};

exports.emailVerify = async(req,res)=>{
    let id = req.params.userId;
    let currentToken = req.params.token;
    const query = { _id: id };
    let user = await User.findOne(query);
    let validToken = user.token;
    if(currentToken === validToken){
        await User.updateOne({_id:id},{$set:{isMailVerified:true}})
        res.status(200).send("email verified");
    }else{
        res.send('Invalid token.');
    }
};

exports.reset = async (req,res)=>{
    try{
        const {error} = validation.reset(req.body);
        if(error){
            return res.status(400).send(error.details[0].message);
        }
        let email = req.body.email;
        let user = await User.findOne({email:email});
        if(!user){
            return res.status(400).send('Email is not registered');
        }else{
            var token = v4();
            if(token){
                await User.updateOne({email:email},{$set :{token :token}});
                mail.resetMail(email,`your reset password token is ${token}`);
            }
            res.status(200).send("reset token has been sent to your registered email.");
        }
    }catch(e){
        res.send(e);
        console.log(e);
    }
    }

exports.newPassword = async(req,res)=>{
    const {error} = validation.newPass(req.body);
    if(error){
        return res.status(400).send(error.details[0].message);
    }
    let email = req.body.email;
    let resetToken = req.body.resetToken;
    let newPass = req.body.password;
    const query = { email: email };
    let user = await User.findOne(query);
    let validToken = user.token;
    if(resetToken === validToken){
        const salt = await bycrypt.genSalt(10);
        const password = await bycrypt.hash(newPass,salt);
        await User.updateOne({email:email},{$set:{password:password}});
        res.send('Password has been reset.');
    }else{
        res.send('Invalid token.');
    }
}

exports.dashboard = async(req,res)=>{
    res.status(200).json({
        data:{
            title:"User Dashboard",
            user:req.data.firstName,
            details:req.data,
            message:"User Content"
        },
    });
};