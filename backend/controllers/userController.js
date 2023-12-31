const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');


//POST request 
//register new user
const registerUser = asyncHandler(async(req, res) => {
    const {name, email, password} = req.body;
    if(!name || !email ||!password){
        res.status(400);
        throw new Error('Please add all fields');
    }

    //check if user exist
    const userExist = await User.findOne({email});

    if(userExist){
        res.status(400);
        throw new Error('User already exist')
    }

    //Hashed password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt)


    //create a user
    const user = await User.create({
        name,
        email,
        password : hashedPassword
    })
    if(user){
        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id),
        })
    }else{
        res.status(400);
        throw new Error('Invalid user data');
    }
}
)

//Authenticate
//POST req api/users/login
const loginUser = asyncHandler(async(req, res)=>{
    const {email, password} = req.body;

    //check for user email
    const user = await User.findOne({email});

    if(user && (await bcrypt.compare(password, user.password))){
        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id),
        })
    }else{
        res.status(400);
        throw new Error('Invalid credentials');
    }
})

//GET api/users/me
const getMe = asyncHandler(async(req, res) => {
    //const {_id, name, email} = await User.findById(req.user.id); //this req.user is whaterver user authenticated
    // res.status(200).json({
    //     id : _id,
    //     name,
    //     email,
    // })
    res.status(200).json(req.user)
})

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: '30d',
    })
}

module.exports = {
    registerUser, 
    loginUser,
    getMe,
}