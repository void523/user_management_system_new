/**
 * requirements for admin services
 */

const bycrypt = require('bcrypt');
const _ = require('lodash');
const {Admin} = require('../models/admin');
const { User } = require('../models/user');
const jwt = require('jsonwebtoken');
const { v4} = require('uuid');
const mail = require('../utils/mail');


/**
 * Service function for admin signUp
 * @param {JSON} req Request body containing user fields
 * @param {string} res Response to be returned to controller
 * @returns Status code and message 
 */

const adminSignUp = async (req,res) => {
    try{
        let admin = await Admin.findOne({email: req.email});
        if(admin){
            return [403,'Admin already registered!']
        }else{
            admin = new Admin(_.pick(req,["name",'email','password','phone_number']));
            const salt = await bycrypt.genSalt(10);
            admin.password = await bycrypt.hash(admin.password,salt);
            await admin.save();
            let email = admin.email;
            var token = v4();
            if(token){
              await Admin.updateOne({email:email},{$set :{token :token}});
              mail.verifyMail(email,`your token is ${token}`);
              const payload = {_id:admin._id,email:admin.email,firstName:admin.firstName};
              const authToken = jwt.sign(payload, process.env.SECRET_TOK, { expiresIn: 10000 }, { algorithm: 'SHA256'});
              let data  = {
                "message":"A new admin has signed up.",
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
 * Service function for admin login
 * @param {JSON} req Request body with login credentials
 * @param {String} res Response to be returned to the controller
 * @returns Status code and message
 */

const adminLogin =  async (req,res) => {
    let admin = await Admin.findOne({email:req.email});
    try{
        if(!admin){
            return [403,'Incorrct email or password!',res]
        }
    const validPass =  await bycrypt.compare(req.password,admin.password);
    if(!validPass){
        return [403,'Incorrct email or password!',res];
    }
    const payload = {_id:admin._id,email:admin.email,firstName:admin.firstName,lastName:admin.lastName};
    const authToken = jwt.sign(payload, process.env.SECRET_TOK, { expiresIn: 10000 }, { algorithm: 'SHA256'});
        let data = {
            "x-auth":authToken,
            "message":"Login successful.",
        }
        return [200,data,res]    
    }catch(e){
        return [403,e,res]
    }
}


/**
 * Service function for admin dashboard via JWT based authentication
 * @param {string} req Request Header with authentication token
 * @param {JSON} res Reponse to pass on the controller
 * @returns JSON object indicating admin dashboard and contents
 */

const adminDashboard = async (req,res) => { 
try{
    let data = {
        data:{
            title:"Admin Dashboard",
            admin:req.data.name,
            details:req.data,
            message:"Admin Content"
        }
    }
    return [200,req,res]
}catch(e){
    return [403,'Invalid token']
}
}


/**
 * Service function to all user details
 * @param {string} req Request header with authentication token 
 * @param {JSON} res Response to pass to controller
 * @returns status code and JSON object of all users
 */

const allUser = async (req,res) =>{
    try{
        let users = await User.aggregate([{$project :{email:1,phone_number:1,firstName:1,lastName:1,country:1,gender:1}}]);
        return [200,users,res]
    }catch(e){
        return [403,e,res]
    }
}


/**
 * Service function to specific user details
 * @param {string} req Request header with authenttication header and userdId to retrieve specific user data
 * @param {JSON} res response to pass to controller
 * @returns status code and JSON object as user details
 */

const getUser = async (req,res) => {
    try{
        let id = req.params.userId;
        const query = { _id: id };
        const options = {
            projection: { _id: 0, email: 1, phone_number: 1 },
          };
        let user = await User.findOne(query);
        return [200,user,res]
    }catch(e){
        return [403,e,res]
    }
}


/**
 * Service function for Updating a specific user bu _id
 * @param {string} req Authentication token as request header and userId 
 * @param {string} res response to be passed to controller
 * @returns String indicating progress of updation
 */

const updateUser = async (req,res) => {
    try{
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
    return [200,'User fields updated',res]
    }catch(e){
        return [403,e,res]
    }
}


/**
 * Service function to delete a specific user by _id
 * @param {string} req Authentication token as header and user id of specific user
 * @param {string} res response to be pass to the controller
 * @returns status code and message indicating progress of deletion
 */

const deleteUser = async (req,res) => {

    try{
        let id = req.params.userId;
        await User.deleteOne({_id:id});
        res.send("Deletion successfull");
        return [200,'Deletion successful',res]
    }catch(e){
        return [403,e,res]
    }
}



module.exports = {
    adminSignUp,adminLogin,adminDashboard,allUser,getUser,updateUser,deleteUser
}