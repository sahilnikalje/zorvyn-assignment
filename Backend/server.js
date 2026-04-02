require('dotenv').config()
const express=require('express')
const connectDB = require('./config/db')

const authRoutes = require('./routes/authRoutes')


const app=express()

app.use(express.json())


app.get('/', (req,res)=>{
    res.send('Server Running')
})

app.use('/api/auth', authRoutes)

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