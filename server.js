const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());
app.use(cookieParser());

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

userSchema.pre('save' ,async function(next) {
    if(this.isModified('password')){
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password , salt);
    }
    next();
})

const User = mongoose.model('User' , userSchema);


const verifyToken = (req,res,next) =>{
    const token = req.cookies.token;
    if(!token){
        return res.status(403).json({message : "No token"})
    }

    jwt.verify(token , process.env.TOKEN , (err,decoded) =>{
        if(err){
            return res.status(403).json({message : "No token"})
        }
        req.user = decoded;
        next();
    })
}

app.get('/',async(req,res)=>{
 res.json({message : "Running...."})
})

app.post('/create' ,async(req,res)=>{
    const {name , email , password} = req.body;
    try {
        const user = await User.create({name , email , password});
        
        res.status(201).send(user);
    } catch (error) {
        console.log(error.message)
        res.status(500).json({message : error.message})
    }
})

app.post('/login', async(req,res)=>{
    const {email , password} = req.body;
    try {

        const user = await User.findOne({email});

        if(!email){
            res.status(404).json({message :"User not found"})
        }
        const isMatch = await bcrypt.compare(password , user.password);
        if(!isMatch){
            res.status(401).json({message : "Credentials not match"})
        }

        const token = jwt.sign({id : user._id, email : user.email} , process.env.TOKEN);
        res.cookie('token',token);

        res.status(200).json({message : "login successfull"})
    } catch (error) {
        console.log(error)
        res.status(500).json({message : error.message})
    }
})
app.get('/all', verifyToken ,async(req,res)=>{
    try {
        const users = await User.find();

        res.status(200).send(users);
    } catch (error) {
        console.log(error)
        res.status(500).json({message : error.message})
    }
})

app.get('/profile/:id' , async(req,res)=>{
     const id = req.params.id;
     try {
         const user = await User.findById(id);
         if(!user){
            return res.status(404).json({message : "user not found"})
         }
         res.status(200).send(user);
     } catch (error) {
        console.log(error)
        res.status(500).json({message : error.message})
    }
})

app.patch('/update/:id' , verifyToken ,async(req,res)=>{
    const {id} = req.params;
    const {name , email , password} = req.body;
    try {
        const user = await User.findById(id);
        if(name){
            user.name = name;
        }
        if(email){
            user.email = email;
        }
        if(password){
            const salt = await bcrypt.genSalt(10);

            user.password = await bcrypt.hash(password , salt);
        }
        await user.save();
        res.status(200).send(user);
    } catch (error) {
        console.log(error)
        res.status(500).json({message : error.message})
    }
})
app.delete('/del/:id' , verifyToken ,async(req,res)=>{
    const id = req.params.id;
    try {
        
        const user = await User.findByIdAndDelete(id);
        res.clearCookie('token');
        
        res.status(200).json({message : "Deleted"});
    } catch (error) {
        console.log(error)
        res.status(500).json({message : error.message})
    }
})



app.listen(8000 , ()=>{
    console.log('Server is listeninngg...');
})