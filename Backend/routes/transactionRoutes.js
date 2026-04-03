const express=require('express')
const protect=require('../middlewares/authMiddleware')
const authorizeRoles=require('../middlewares/rolesMiddleware')
const{getTransactions, getTransactionById, createTransaction, updateTransaction, deleteTransaction}=require('../controllers/transactionController')

const transactionRouter=express.Router()

transactionRouter.get('/', protect, authorizeRoles('viewer', 'analyst', 'admin'), getTransactions)
transactionRouter.get('/:id', protect, authorizeRoles('viewer', 'analyst', 'admin'), getTransactionById)
transactionRouter.post('/', protect, authorizeRoles('admin'), createTransaction)
transactionRouter.put('/:id', protect, authorizeRoles('admin'), updateTransaction)
transactionRouter.delete('/:id', protect, authorizeRoles('admin'), deleteTransaction)

module.exports=transactionRouter
