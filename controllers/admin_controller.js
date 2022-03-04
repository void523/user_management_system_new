const bycrypt = require('bcrypt');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const {Admin} = require('../models/admin');
const { User } = require('../models/user');
const validation = require('../validate');

exports.signUp = async(req,res)=>{
    const {error} = validation.validateAdminSignUp(req.body);
    if(error){
      return res.status(400).send(error.details[0].message);
    }
    let admin = await Admin.findOne({email: req.body.email});
    if(admin){
      return res.status(400).send("That Admin already exists");
    }else{
      admin = new Admin(_.pick(req.body,["name",'email','password','phone_number']));
      const salt = await bycrypt.genSalt(10);
      admin.password = await bycrypt.hash(admin.password,salt);
      await admin.save();
      const payload = {_id:admin._id,email:admin.email,name:admin.name};
      const authToken = jwt.sign(payload, process.env.SECRET_TOK, { expiresIn: 10000 }, { algorithm: 'SHA256'});
      res.status(200).json({
        data:{
            "message":"A new admin has signed up.",
            "x-auth":authToken
        }
    });
    }
  };


exports.login =  async(req,res)=>{
    const {error} = validation.loginValidation(req.body);
    if(error){
        return res.status(400).send(error.details[0].message);
    }
    let admin = await Admin.findOne({email:req.body.email});
    if(!admin){
        return res.status(400).send('Incorrct email or password');
    }
    const validPass =  await bycrypt.compare(req.body.password,admin.password);
    if(!validPass){
        return res.status(400).send('Incorrect email or password');
    }
    const payload = {_id:admin._id,email:admin.email,name:admin.name}
    const authToken = jwt.sign(payload, process.env.SECRET_TOK, { expiresIn: 10000 }, { algorithm: 'SHA256'});
    res.status(200).json({
        data:{
            "message":"Admin login successful",
            "x-auth":authToken
        }
    });
};

exports.dashboard = async(req,res)=>{
    res.status(200).json({
        data:{
            title:"Admin Dashboard",
            admin:req.data.name,
            details:req.data,
            message:"Admin Content"
        },
    });
};


exports.getAllUsers =  async (req,res)=>{
    let users = await User.aggregate([{$project :{email:1,phone_number:1,firstName:1,lastName:1,country:1,gender:1}}]);
    res.send(users);
};

exports.getUserById =  async(req,res)=>{
    try{
        let id = req.params.userId;
        const query = { _id: id };
        const options = {
            projection: { _id: 0, email: 1, phone_number: 1 },
          };
        let user = await User.findOne(query);
        res.send(user);
    }catch(e){
        res.send(e);
        console.log(e);
    }
};

exports.updateUserById = async(req,res)=>{
    let id = req.params.userId;
    const query = { _id: id };
    const user_update = req.body;
    console.log(user_update)
    await User.updateMany({_id:id},{$set :{
    firstName : user_update.firstName,
    lastName : user_update.lastName,
    country : user_update.country,
    phone_number : user_update.phone_number,
    gender : user_update.gender,
    address : user_update.address 
}
});
    res.send('document updated.')
};

exports.deleteUserById = async(req,res)=>{
    let id = req.params.userId;
    await User.deleteOne({_id:id});
    res.send("Deletion successfull");
};

