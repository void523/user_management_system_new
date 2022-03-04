/**
 * requirement for user_controller
 */
const bycrypt = require('bcrypt');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const {Admin} = require('../models/admin');
const { User } = require('../models/user');
const validation = require('../validate');

/**
 * Function for admin registration
 * @param {JSON} req request a JSON object containing admin schema for registration
 * @param {JSON} res response a JSON object containing message and JWT token
 * @returns message and token indicating user signup
 */
exports.signUp = async (req,res)=>{
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

/**
 * Funtion for login of registered admin
 * @param {JSON} req request a JSON onject containing email and password to login
 * @param {JSON} res response a JSON object with message and JWT token
 * @returns message indicating admin login and JWT token
 */
exports.login =  async (req,res)=>{
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

/**
 * Function to display admin dashboard and to perform CRUD operation
 * @param {JSON} req request body containing details of user provided via the JWT token 
 * @param {JSON} res response as JSON object containing basic dashboard information including Admin details
 */
exports.dashboard = async (req,res)=>{
    res.status(200).json({
        data:{
            title:"Admin Dashboard",
            admin:req.data.name,
            details:req.data,
            message:"Admin Content"
        },
    });
};

/**
 * CRUD operation to get all Users in database
 * @param {null} req  
 * @param {JSON} res a response as JSON object with all users in the database 
 */
exports.getAllUsers =  async (req,res)=>{
    let users = await User.aggregate([{$project :{email:1,phone_number:1,firstName:1,lastName:1,country:1,gender:1}}]);
    res.send(users);
};

/**
 * CRUD operation to get a specific user via user _id
 * @param {string} req Request with parameter containing a specific user _id 
 * @param {JSON} res response as JSON object with the specific user details
 */
exports.getUserById =  async (req,res)=>{
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

/**
 * CRUD operation to update a user fields via user _id
 * @param {JSON} req A request with body containing a JSON object of fields to be updated
 * @param {String} res a response message indicating whether the operation is successfull
 */
exports.updateUserById = async (req,res)=>{
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


/**
 * CRUD operation to delete a specific user via user _id
 * @param {string} req a request with params containing the user _id of specific user
 * @param {string} res a response message indicating whether the operation is successfull
 */
exports.deleteUserById = async (req,res)=>{
    let id = req.params.userId;
    await User.deleteOne({_id:id});
    res.send("Deletion successfull");
};

