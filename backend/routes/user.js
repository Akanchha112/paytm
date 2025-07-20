const express= require('express')
const User= require('../db.js');
var jwt = require('jsonwebtoken');
const config= require('../config')
const zod= require("zod");
const bcrypt = require('bcrypt'); 

const router= express.Router();

const signupSchema=zod.object({
    username:zod.string(),
    password:zod.string(),
    firstname:zod.string(),
    lastname:zod.string()
});

router.get('/',(req,res,next)=>{
    console.log("hello world");
    res.send("hello world");
});



router.post('/signup', async (req, res) => {
    try {
        const body = req.body;

        const parsed = signupSchema.safeParse(body);
        if (!parsed.success) {
            return res.status(400).json({ msg: "Invalid input" });
        }

        const existingUser = await User.findOne({ username: body.username });
        if (existingUser) {
            return res.status(400).json({ msg: "Email is already taken" });
        }

        const hashedPassword = await bcrypt.hash(body.password, 10);

        const newUser = new User({
            username: body.username,
            password: hashedPassword,
            firstName: body.firstname,
            lastName: body.lastname
        });

        await newUser.save();

        const token = jwt.sign({ id: newUser._id }, config.JWT_SECRET);
        res.status(200).json({ msg: 'User created successfully', jwt: token });

    } catch (error) {
        console.error('Error saving data:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

const signinSchema = zod.object({
    username: zod.string(),
    password: zod.string()
});

router.post('/signin', async (req, res) => {
    try {
        const body = req.body;

        const parsed = signinSchema.safeParse(body);
        if (!parsed.success) {
            return res.status(400).json({ msg: "Invalid input" });
        }

        const user = await User.findOne({ username: body.username });
        if (!user) {
            return res.status(401).json({ msg: "Invalid credentials" });
        }

        const isPasswordCorrect = await bcrypt.compare(body.password, user.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ msg: "Invalid credentials" });
        }

        const token = jwt.sign({ id: user._id }, config.JWT_SECRET);
        res.status(200).json({ msg: 'Login successful', jwt: token });

    } catch (error) {
        console.error('Error during signin:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});


module.exports =router