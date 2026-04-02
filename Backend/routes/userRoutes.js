const express=require('express')
const authorizeRoles = require('../middlewares/rolesMiddleware')
const{getAllUsers, getUserById, updateUserRole, updateUserStatus}=require('../controllers/userController')
const protect=require('../middlewares/authMiddleware')
const userRouter=express.Router()

userRouter.use(protect, authorizeRoles('admin'))

userRouter.get('/', getAllUsers)
userRouter.get('/:id', getUserById)
userRouter.patch('/:id/role', updateUserRole)
userRouter.patch('/:id/status', updateUserStatus)


module.exports=userRouter
