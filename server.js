const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

mongoose.connect("mongodb://localhost:27017/tutorial")
.then(()=>console.log('Mongodb connected'))


const userSchema = new mongoose.Schema({
    name: String,
    email : {
        type : String,
        unique : true
    },
    password : String
})

const User = mongoose.model('User' , userSchema);


app.get('/',async(req,res)=>{
 res.json({message : "Running...."})
})

app.post('/create' ,async(req,res)=>{
    const {name , email , password} = req.body;
    try {
        const user = await User.create({name , email , password});
        
        res.status(200).send(user);
    } catch (error) {
        console.log(error)
        res.status(500).json({message : "Something went wrong"})
    }
})
app.get('/all',async(req,res)=>{
    try {
        const users = await User.find();

        res.status(200).send(users);
    } catch (error) {
        console.log(error)
        res.status(500).json({message : "Something went wrong"})
    }
})

app.patch('/update/:id' ,async(req,res)=>{
    const {id} = req.params;
    const {name , email , password} = req.body;
    try {
        const user = await User.findById({id});
        if(name){
            user.name = name;
        }
        if(email){
            user.email = email;
        }
        if(password){
            user.password = password;
        }
        await user.save();
        res.status(200).send(user);
    } catch (error) {
        console.log(error)
        res.status(500).json({message : "Something went wrong"})
    }
})
app.delete('/del/:id' ,async(req,res)=>{
    const id = req.params.id;
    try {
        const user = await User.findByIdAndDelete(id);
        
        res.status(200).json({message : "Deleted"});
    } catch (error) {
        console.log(error)
        res.status(500).json({message : "Something went wrong"})
    }
})



app.listen(8000 , ()=>{
    console.log('Server is listeninngg...');
})