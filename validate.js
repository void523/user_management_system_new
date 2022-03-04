const Joi = require('joi')

exports.validateUserSignUp = (user)=>{
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

exports.validateAdminSignUp = (admin)=>{
    const schema = {
        name: Joi.string().min(2).max(50).required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(7).max(255).required().strict(),
        confirm_password: Joi.string().valid(Joi.ref('password')).strict(),
        phone_number: Joi.number().min(10).required(),
    };
    return Joi.validate(admin,schema)
}

exports.loginValidation = (data)=>{
    const schema = {
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required()
    };
    return Joi.validate(data,schema);
}

exports.reset = (email) =>{
    const schema = {
        email: Joi.string().min(5).max(255).required().email().required(),
    };
    return Joi.validate(email,schema);
}

exports.newPass = (req)=>{
    const schema = {
        email: Joi.string().min(5).max(255).required().email().required(),
        password: Joi.string().min(5).max(255).required(),
        resetToken: Joi.string().required()
    };
    return Joi.validate(req,schema);
}