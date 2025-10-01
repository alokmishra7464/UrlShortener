// import the user model 
const User = require('../models/User');
// we will use bcryptjs for password hashing and jsonwebtoken for user authentication
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// User Registeration

exports.register = async(req, res) => {
    const {email, password} = req.body; // take email and pass from the req body 

    const exists = await User.findOne({email}); // find the email in the database
    if(exists) return res.status(400).json({message: "User already exists"}); // if found return user exists.
    // if not found
    // then register the new user
    const hashedPass = await bcrypt.hash(password, 10); // hash the password -> size of 10
    const newUser = new User({email, password: hashedPass}); // register the new user details in database (hashedpass as pass)
    await newUser.save();

    res.status(201).json({message: "User registered"});
};

// User Login 

exports.login = async(req,res) => {
    const {email, password} = req.body; // destruct email & pass from req body
    const user = await User.findOne({email}); // check the user in db
    if(!user) return res.status(400).json({message: "Invalid email"}); // not found

    const isMatch = await bcrypt.compare(password, user.password); // compare hashed pass
    if(!isMatch) return res.status(400).json({message: "Invalid password"}); // not matched

    const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '1d'}); // generate token

    res.json({token}); // return the token 
};