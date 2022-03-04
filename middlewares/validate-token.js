const jwt =require('jsonwebtoken');

/**
 * 
 * @param {string} req a request with auth-token to be verified in request header 
 * @param {string} res a response message indicating whether it was successfull
 * @param {null} next a function to continue to next process
 * @returns message indicating the result if error occurs
 */
exports.verifytoken = (req,res,next)=>{
    const token = req.header('auth-token');
    if(!token) return res.status(401).json({error: "no token in header"});

    try{
        const verified = jwt.verify(token, process.env.SECRET_TOK);
        req.data = verified;
        console.log(verified);
        next();
    }catch(err){
        res.status(400).json({error:"Token is not valid"});
    }
};

