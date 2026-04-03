const Transaction=require('../models/transactionSchema')

const getTransactions=async(req,res)=>{
    try{
        const{type, category, startDate, endDate, search, page=1, limit=10}=req.query
        const filter={isDeleted:false}

        if(type){
            filter.type=type
        }
        if(category){
            filter.category=new RegExp(category, 'i')
        }
        if(startDate || endDate){
            filter.date={}
            if(startDate){
                filter.date.$gte=new Date(startDate)
            }
            if(endDate){
                filter.date.$lte=new Date(endDate)
            }
        }
        if(search){
            filter.$or=[{notes:new RegExp(search, 'i')},{category:new RegExp(search, 'i')}]
        }

        const skip=(Number(page)-1)*Number(limit)
        const total=await Transaction.countDocuments(filter)
        const transactions=await Transaction.find(filter)
             .populate('createdBy', 'name email')
             .sort({date:-1})
             .skip(skip)
             .limit(Number(limit))
        
        res.status(200).json({
            success:true, 
            total,
            page:Number(page),
            totalPages:Math.ceil(total/Number(limit)),
            data:transactions
        })
    }
    catch(err){
        console.log("getTransactionsErr: ", err.message)
        res.status(500).json({success:false, message:err.message})
    }
}

const getTransactionById=async(req,res)=>{
    try{
        const transaction=await Transaction.findOne({_id:req.params.id, isDeleted:false}).populate('createdBy', 'name email')
        if(!transaction){
            return res.status(404).json({success:false, message:"Transaction not found"})
        }

        res.status(200).json({success:true, data:transaction})
    }
    catch(err){
        console.log('getTransactionByIdErr: ', err.message)
        res.status(500).json({success:false, message:err.message})
    }
}

const createTransaction=async(req,res)=>{
    try{
        const{amount, type, category, date, notes}=req.body
        if(!amount || !type || !category || !date){
            return res.status(400).json({success:false, message:"All fields are mandetory"})
        }

        const transaction=await Transaction.create({
            amount,
            type,
            category,
            date,
            notes,
            createdBy:req.user._id
        })

        res.status(201).json({success:true, message:"Transaction created", data:transaction})
    }
    catch(err){
        console.log('createTransactionErr: ', err.message)
        res.status(500).json({success:false, message:err.message})
    }
}

const updateTransaction=async(req,res)=>{
    try{
        const transaction=await Transaction.findOne({_id:req.params.id, isDeleted:false})
        if(!transaction){
            return res.status(404).json({success:false, message:"Transaction not found"})
        }

        const {amount, type, category, date, notes}=req.body
        
        if(amount!==undefined) transaction.amount=amount
        if(type!==undefined) transaction.type=type
        if(category!==undefined) transaction.category=category
        if(date!==undefined) transaction.date=date
        if(notes!==undefined) transaction.notes=notes

        await transaction.save()
        res.status(200).json({success:true, message:"Transaction updated", data:transaction})
    }
    catch(err){
        console.log('updateTransactionErr: ', err.message)
        res.status(500).json({success:false, message:err.message})
    }
}

const deleteTransaction=async(req,res)=>{
    try{
        const transaction=await Transaction.findOne({_id:req.params.id, isDeleted:false})
        if(!transaction){
            return res.status(404).json({success:false, message:'Transaction not found'})
        }

        transaction.isDeleted=true
        transaction.deletedAt=new Date()
        await transaction.save()
        res.status(200).json({success:true, message:"Transaction deleted"})
    }
    catch(err){
        console.log('deleteTransactionErr: ', err.message)
        res.status(500).json({success:false, message:err.message})
    }
}

module.exports={getTransactions, getTransactionById, createTransaction, updateTransaction, deleteTransaction}