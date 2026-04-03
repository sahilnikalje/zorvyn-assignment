const mongoose=require('mongoose')

const transactionSchema=new mongoose.Schema({
    amount:{type:Number, required:true, min:0.01},
    type:{type:String, enum:['income', 'expense'], required:true},
    category:{type:String, required:true},
    date:{type:Date, required:true},
    notes:{type:String, trim:true, default:""},
    createdBy:{type:mongoose.Schema.Types.ObjectId, ref:"User", required:true},
    isDeleted:{type:Boolean, default:false},
    deletedAt:{type:Date, default:null}
},{
    timestamps:true
})

module.exports=mongoose.model("Transaction", transactionSchema)