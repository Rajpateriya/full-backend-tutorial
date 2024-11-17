const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const app = express();

mongoose.connect("mongodb://localhost:27017/tutorial")
.then(()=>console.log('Mongodb connected'))


const userSchema = new mongoose.Schema({
    name: String,
    email : String,
    password : String
})

const User = new mongoose.model('User' , userSchema);


app.get('/',async(req,res)=>{
 res.json({message : "Running...."})
})





app.listen(8000 , ()=>{
    console.log('Server is listeninngg...');
})