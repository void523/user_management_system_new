const Joi = require('joi')

/**
 * joi validation for user signup 
 * @param {JSON} user a JSON object containing the details of new user to be registered 
 * @returns Return an error if joi validation fails
 */

const validateUserSignUp = (user)=>{
    const schema = {
        firstName: Joi.string().min(2).max(50).required(),
        lastName: Joi.string().min(2).max(50).required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(7).max(255).required().strict(),
        confirm_password: Joi.string().valid(Joi.ref('password')).strict(),
        country: Joi.string().min(4).max(65),
        phone_number: Joi.number().min(10).required(),
        gender: Joi.string().min(4).max(10),
        address: Joi.string().min(4).max(255),
        isMailVerified: Joi.boolean(),
        token:Joi.string()
    };
    return Joi.validate(user,schema)
}

/**
 * joi validation for admin signup 
 * @param {JSON} admin a JSON object containing the details of new admin to be registered 
 * @returns Return an error if joi validation fails
 */

const validateAdminSignUp = (admin)=>{
    const schema = {
        name: Joi.string().min(2).max(50).required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(7).max(255).required().strict(),
        confirm_password: Joi.string().valid(Joi.ref('password')).strict(),
        phone_number: Joi.number().min(10).required(),
    };
    return Joi.validate(admin,schema)
}

/**
 * Joi validation for admin/user 
 * @param {JSON} data a JSON object containing the login credentials 
 * @returns returns error if joi validation fails
 */

const loginValidation = (data)=>{
    const schema = {
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required()
    };
    return Joi.validate(data,schema);
}

/**
 * joi validation for password reset
 * @param {string} email  email of user initiating password reset 
 * @returns returns error if joi validation fails
 */

const reset = (email) =>{
    const schema = {
        email: Joi.string().min(5).max(255).required().email().required(),
    };
    return Joi.validate(email,schema);
}

/**
 * joi validation for updating new password
 * @param {JSON} req request with JSON object containing email,reset-token and new password 
 * @returns returns error if joi validation fails
 */

const newPass = (req)=>{
    const schema = {
        email: Joi.string().min(5).max(255).required().email().required(),
        password: Joi.string().min(5).max(255).required(),
        resetToken: Joi.string().required()
    };
    return Joi.validate(req,schema);
}

module.exports = {
    validateUserSignUp,validateAdminSignUp,loginValidation,reset,newPass
};