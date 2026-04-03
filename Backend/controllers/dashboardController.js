const Transaction=require('../models/transactionSchema')

const getSummary=async(req, res)=>{
    try{
        const result=await Transaction.aggregate([
            {$match:{isDeleted:false}},
            {$group:{_id:'$type', total:{$sum:'$amount'}}}
        ])

        let totalIncome=0
        let totalExpenses=0

        result.forEach(item=>{
            if(item._id==='income'){
                totalIncome=item.total
            }
            if(item._id==='expense'){
                totalExpenses=item.total
            }
        })

        res.status(200).json({
            success:true, 
            data:{
                totalIncome,
                totalExpenses,
                netBalance:totalIncome-totalExpenses
            }
        })
    }
    catch(err){
        console.log('getSummary: ', err.message)
        res.status(500).json({success:false, message:err.message})
    }
}

const getCategoryTotals=async(req,res)=>{
    try{
        const match={isDeleted:false}
        if(req.query.type){
            match.type=req.query.type
        }

        const result=await Transaction.aggregate([
            {$match:match},
            {$group:{_id:'$category', total:{$sum:'$amount'}, count:{$sum:1}}},
            {$sort:{total:-1}}
        ])

        res.status(200).json({success:true, data:result})
    }
    catch(err){
        console.log('getCategoryTotalsErr: ',err.message)
        res.status(500).json({success:false, message:err.message})
    }
}

const getMonthlyTrends=async(req,res)=>{
    try{
        const year=Number(req.query.year) || new Date().getFullYear()

        const result=await Transaction.aggregate([
            {$match:{isDeleted:false, date:{$gte:new Date(`${year}-01-01`), $lte:new Date(`${year}-12-31`)}}},
            {$group:{_id:{month:{$month:"$date"}, type:"$type"}, total:{$sum:"$amount"}}},
            {$sort:{"_id.month":1}}
        ])

        const months=Array.from({length:12}, (_,i)=>({month:i+1, income:0, expense:0}))
        
        result.forEach(({_id, total})=>{
            if(_id.type==='income'){
                months[_id.month-1].income=total
            }
            if(_id.type==='expense'){
                months[_id.month-1].expense=total
            }
        })

        res.status(200).json({success:true, year, data:months})
    }
    catch(err){
        console.log('getMonthlyTrendsErr: ', err.message)
        res.status(500).json({success:false, message:err.message})
    }
}

const getRecentActivity=async(req,res)=>{
    try{
        const limit=Number(req.query.limit) || 5
        const transactions=await Transaction.find({isDeleted:false})
                           .populate('createdBy', 'name')
                           .sort({createdAt:-1})
                           .limit(limit)
        
        res.status(200).json({success:true, data:transactions})
    }
    catch(err){
        console.log('getRecentActivityErr: ', err.message)
        res.status(500).json({success:false, message:err.message})
    }
}

module.exports={getSummary, getCategoryTotals, getMonthlyTrends, getRecentActivity}