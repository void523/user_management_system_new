/**
 * requirement for user_controller
 */

const validation = require('../validate');
const adminServices = require('../services/admin_services')


/**
 * Function for admin registration
 * @param {JSON} req request a JSON object containing admin schema for registration
 * @param {JSON} res response a JSON object containing message and JWT token
 * @returns message and token indicating user signup
 */

  const signUp = async (req,res)=>{

    try{
        let validateAdminSignUp = await validation.validateAdminSignUp(req.body);
        let result = await adminServices.adminSignUp(validateAdminSignUp,res);
        if(result){
            res.status(result[0]).send(result[1])
        }
    }catch(e){
        res.status(result[0]).send(result[1])
       }
  };


/**
 * Funtion for login of registered admin
 * @param {JSON} req request a JSON onject containing email and password to login
 * @param {JSON} res response a JSON object with message and JWT token
 * @returns message indicating admin login and JWT token
 */

const login =  async (req,res)=>{

    try{
        let validateLogin = await validation.loginValidation(req.body);
        let result = await adminServices.adminLogin(validateLogin,res);
        if(result){
            res.status(result[0]).send(result[1])
        }
    }catch(e){
        res.status(result[0]).send(result[1])
       }
};


/**
 * Function to display admin dashboard and to perform CRUD operation
 * @param {JSON} req request body containing details of user provided via the JWT token 
 * @param {JSON} res response as JSON object containing basic dashboard information including Admin details
 */

const dashboard = async (req,res)=>{
    try{
        let result = await adminServices.adminDashboard(req,res)
        if(result){
            res.status(result[0]).send(result[1])
        }
    }
    catch(e){
        res.status(result[0]).send(result[1])
    }
};


/**
 * CRUD operation to get all Users in database
 * @param {null} req  
 * @param {JSON} res a response as JSON object with all users in the database 
 */

const getAllUsers = async (req,res) =>{
try{
    let result = await adminServices.allUser(req,res)
    if(result){
        res.status(result[0]).send(result[1])
    }
}catch(e){
    res.status(result[0]).send(result[1])
}
}


/**
 * CRUD operation to get a specific user via user _id
 * @param {string} req Request with parameter containing a specific user _id 
 * @param {JSON} res response as JSON object with the specific user details
 */

const getUserById =  async (req,res)=>{
    try{
        let result = await adminServices.getUser(req,res)
        if(result){
            res.status(result[0]).send(result[1])
        }
    }catch(e){
        res.status(result[0]).send(result[1])
    }
};


/**
 * CRUD operation to update a user fields via user _id
 * @param {JSON} req A request with body containing a JSON object of fields to be updated
 * @param {String} res a response message indicating whether the operation is successfull
 */

const updateUserById = async (req,res)=>{

    try{
        let result = await adminServices.updateUser(req,res)
        if(result){
            res.status(result[0]).send(result[1])
        }
    }catch(e){
        res.status(result[0]).send(result[1])
    }
};


/**
 * CRUD operation to delete a specific user via user _id
 * @param {string} req a request with params containing the user _id of specific user
 * @param {string} res a response message indicating whether the operation is successfull
 */

const deleteUserById = async (req,res)=>{

    try{
        let result = await adminServices.deleteUser(req,res)
        if(result){
            res.status(result[0]).send(result[1])
        }
    }catch(e){
        res.status(result[0]).send(result[1])
    }
};



module.exports = {
    signUp,login,dashboard,getAllUsers,getUserById,updateUserById,deleteUserById
};