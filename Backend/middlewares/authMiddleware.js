const jwt=require('jsonwebtoken')
const User=require('../models/userSchema')

const protect=async(req,res,next)=>{
    try{
        const authHeader=req.headers.authorization
        if(!authHeader || !authHeader.startsWith('Bearer ')){
            return res.status(401).json({success:false, message:'Not Authorized'})
        }

        const token=authHeader.split(' ')[1]
        const decoded=jwt.verify(token, process.env.JwT_SECRET)
        const user=await User.findById(decoded.id).select('-password')

        if(!user){
            return res.status(401).json({success:false, message:'User not found'})
        }
        if(user.status==='inactive'){
            return res.status(403).json({success:false, message:'Acount is inactive'})
        }

        req.user=user
        next()
    }
    catch(err){
        console.log('protectErr: ', err.message)
        return res.status(401).json({success:false, message:'Invalid token'})
    }
}

module.exports=protect
