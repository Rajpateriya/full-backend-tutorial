const express = require('express');
const mongoose = require('mongoose');
const app = express();

app.get('/',async(req,res)=>{
 res.json({message : "Running...."})
})

app.listen(8000 , ()=>{
    console.log('Server is listeninngg...');
})