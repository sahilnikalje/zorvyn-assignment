const jwt=require('jsonwebtoken')
const User=require('../models/userSchema')

const generateToken=(id)=>{
 return jwt.sign(
        {id},
        process.env.JWT_SECRET,
        {expiresIn:'7d'}
    )
}

const register=async(req,res)=>{
    try{
        const{name, email, password, role}=req.body
        if(!name || !email || !password){
            return res.status(400).json({success:false, message:"All fields are mandetory"})
        }

        const existing=await User.findOne({email})
        if(existing){
            return res.status(400).json({success:false, message:"User already exists"})
        }

        const user=await User.create({
            name, email, password, role
        })

        res.status(201).json({
            success:true, 
            data:{
                id:user._id, 
                name:user.name, 
                email:user.email, 
                role:user.role, 
                token:generateToken(user._id)
            }
        })
    }
    catch(err){
        console.log('registerErr: ', err.message)
        res.status(500).json({success:false, message:err.message})
    }
}

const login=async(req,res)=>{
    try{
        const{email, password}=req.body

        if(!email || !password){
            return res.status(400).json({success:false, message:"All fields are mandetory"})
        }

        const user=await User.findOne({email})
        if(!user || !(await user.matchPassword(password))){
            return res.status(401).json({success:false, message:'Invalid Credentials'})
        }

        if(user.status==='inactive'){
            return res.status(403).json({success:false, message:'Acount is inactive'})
        }

        res.status(200).json({
            success:true,
            data:{
                id:user._id,
                name:user.name,
                email:user.email,
                role:user.role,
                token:generateToken(user._id)
            }
        })
    }
    catch(err){
        console.log('loginErr: ', err.message)
        res.status(500).json({success:false, message:err.message})
    }
}

const getMe=(req,res)=>{
    res.status(200).json({success:true, data:req.user})
}

module.exports={register, login, getMe}