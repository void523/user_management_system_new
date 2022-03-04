const jwt =require('jsonwebtoken');

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

