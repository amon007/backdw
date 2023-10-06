const express = require('express')
const mongoose = require('mongoose')
const authRouter = require('./authRouter')
const PORT = process.env.PORT || 5000

const app = express()

app.use(express.json())
app.use('/auth', authRouter)
const start = async () => {
    try{
        await mongoose.connect('mongodb+srv://rhayrapetyan157:49C3pwdKTq3qeUGH@cluster0.myelu7k.mongodb.net/naut2?retryWrites=true&w=majority')
        app.listen(PORT, ()=> console.log(`server started on port ${PORT}`))
    } catch (error){
        console.log(error);
    }
}

start()

//49C3pwdKTq3qeUGH