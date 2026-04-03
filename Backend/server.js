require('dotenv').config()
const express=require('express')
const limiter=require('./middlewares/rateLimiter')
const connectDB = require('./config/db')

const authRoutes = require('./routes/authRoutes')
const userRoutes=require('./routes/userRoutes')
const transactionRoutes = require('./routes/transactionRoutes')
const dashboardRoutes = require('./routes/dashboardRoutes')

const app=express()

app.use(express.json())
app.use(limiter)

app.get('/server', (req,res)=>{
    res.send('Server Running')
})

app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/transactions', transactionRoutes)
app.use('/api/dashboard', dashboardRoutes)

const PORT=process.env.PORT
const startServer=async()=>{
    try{
        await connectDB()
        app.listen(PORT, ()=>{
            console.log(`Server running on port ${PORT}`)
        })
    }
    catch(err){
        console.log(err.message)
        process.exit(1)
    }
}
startServer()