const User=require('../models/userSchema')

const getAllUsers=async(req,res)=>{
    try{
        const{role, status, page=1, limit=10}=req.query
        const filter={}

        if(role){
            filter.role=role
        }
        if(status){
            filter.status=status
        }

        const skip=(Number(page)-1)*Number(limit)
        const total=await User.countDocuments(filter)
        const users=await User.find(filter).select('-password').skip(skip).limit(Number(limit))

        res.status(200).json({
            success:true, 
            total, 
            page:Number(page), 
            totalPages:Math.ceil(total/Number(limit)), 
            data:users
        })
    }
    catch(err){
        console.log('getAllUsersErr: ', err.message)
        res.status(500).json({success:false, message:err.message})
    }
}

const getUserById=async(req,res)=>{
    try{
        const user=await User.findById(req.params.id).select('-password')
        if(!user){
            return res.status(404).json({success:false, message:'User not found'})
        }

        res.status(200).json({success:true, data:user})
    }
    catch(err){
        console.log('getUserByIdErr: ', err.message)
        res.status(500).json({success:false, message:err.message})
    }
}

const updateUserRole=async(req,res)=>{
    try{
        const{role}=req.body
        if(!['viewer', 'analyst', 'admin'].includes(role)){
            return res.status(400).json({success:false, message:'Invalid role'})
        }

        const user=await User.findById(req.params.id)

        if(!user){
            return res.status(404).json({success:false, message:'User not found'})
        }
        if(req.user._id.toString()===user._id.toString()){
            return res.status(400).json({success:false, message:'You cannot change your own role'})
        }

        user.role=role
        await user.save()

        res.status(200).json({
            success:true, 
            message:'Role updated', 
            data:{
                id:user._id,
                role:user.role,
            }
        })
    }
    catch(err){
        console.log('updateUserRoleErr: ', err.message)
        res.status(500).json({success:false, message:err.message})
    }
}

const updateUserStatus=async(req,res)=>{
    try{
        const{status}=req.body
        if(!['active', 'inactive'].includes(status)){
            return res.status(400).json({success:false, message:'Invalid status'})
        }

        const user=await User.findById(req.params.id)
        if(!user){
            return res.status(404).json({success:false, message:'User not found'})
        }
        if(req.user._id.toString()===user._id.toString()){
            return res.status(400).json({success:false, message:'You cannot change your own status'})
        }

        user.status=status
        await user.save()

        res.status(200).json({
            success:true, 
            message:'Status updated',
            data:{
                id:user._id,
                status:user.status
            }
        })
    }
    catch(err){
        console.log('updateUserStatusErr: ', err.message)
        res.status(500).json({success:false, message:err.message})
    }
}

module.exports={getAllUsers, getUserById, updateUserRole, updateUserStatus}