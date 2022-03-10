/**
 * requirement for user_controller
 */

const validation = require('../validate');
const userService = require('../services/user_services')

/**
 * a function to create new user
 * @param {JSON} req  req.body containing schema of user to be updated to database
 * @param {JSON} res response of body indicating email verification
 * @returns A json object with JWT token and message
 */

const signUp = async (req,res)=>{

    try{
        let validateSignUp = await validation.validateUserSignUp(req.body);
        let result = await userService.userSignUp(validateSignUp,res);
        console.log(result);
        if(result){
            res.status(result[0]).send(result[1])
        }
    }catch(e){
        res.status(result[0]).send(result[1])
       }
  };

/**
 * Function for User login
 * @param {JSON} req req.body containing a registered user 
 * @param {JSON} res response containing JWT authentication token and message 
 * @returns A json response with JWT token and message
 */

const login =  async (req,res)=>{

    try{
        let validateLogin = await validation.loginValidation(req.body);
        let result = await userService.userLogin(validateLogin,res);
        console.log(result);
        if(result){
            res.status(result[0]).send(result[1])
        }
    }catch(e){
        res.status(result[0]).send(result[1])
       }
};



/**
 * Function for email verification
 * @param {JSON} req request paramters(req.params) containing userId and verification token 
 * @param {string} res response containing message 
 * @returns message indicating whether email verified
 */

const emailVerify = async (req,res)=>{

    try{
        let result = await userService.userMailVerify(req,res)
        if (result){
            res.status(result[0]).send(result[1])
        }
    }catch(e){
        res.status(result[0]).send(result[1])
    }
};

/**
 * Function for initiate password reset
 * @param {JSON} req request with body containing registered email,reset-token,new password 
 * @param {string} res response message indicating sending token to registered mail
 * @returns message indicating reset in initiated
 */

const reset = async (req,res)=>{

    try{
        let resetValidate =  await validation.reset(req.body);
        let result = await userService.resetPass(resetValidate,res)
        if (result){
            res.status(result[0]).send(result[1])
        }    
    }catch(e){
        res.status(result[0]).send(result[1])
    }
};

/**
 * A function to update new password
 * @param {JSON} req request body containing the reset-token, registered email and new password
 * @param {string} res response message indicating whether passsword reset is done
 * @returns updates the new password with message indicating progress
 */ 
   
const newPassword = async (req,res)=>{

    try{
        let passwordValidation = await validation.newPass(req.body);
        let result = await userService.newPass(passwordValidation,res)
        if(result){
            res.status(result[0]).send(result[1])
        } 
    }catch(e){
        res.status(result[0]).send(result[1])
    }
}

/**
 * a function showing user dashboard with user details
 * @param {JSON} req request body containing details of user provided via the JWT token 
 * @param {JSON} res response as JSON object containing basic dashboard information including user details
 */

 const dashboard = async (req,res)=>{
    try{
        let result = await userService.userDashboard(req,res)
        if(result){
            res.status(result[0]).send(result[1])
        }
    }
    catch(e){
        res.status(result[0]).send(result[1])
    }
};

module.exports = {
    signUp,login,emailVerify,reset,newPassword,dashboard
}