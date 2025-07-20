const express= require('express')
const {User,Account}= require('../db.js');
var jwt = require('jsonwebtoken');
const config= require('../config')
const zod= require("zod");
const bcrypt = require('bcrypt'); 
const {auth} = require('../middleware')

const router= express.Router();

const signupSchema=zod.object({
    username:zod.string(),
    password:zod.string(),
    firstname:zod.string(),
    lastname:zod.string()
});

const signinSchema = zod.object({
    username: zod.string(),
    password: zod.string()
});

const updateBody = zod.object({
	password: zod.string().optional(),
    firstName: zod.string().optional(),
    lastName: zod.string().optional(),
})

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

        const userId=newUser._id;

        await Account.create({
            userId,
            balance:1+Math.random()*1000
        })

        const token = jwt.sign({ id: newUser._id }, config.JWT_SECRET);
        res.status(200).json({ msg: 'User created successfully', jwt: token });

    } catch (error) {
        console.error('Error saving data:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
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


router.put('/update',auth,async(req,res)=>{
    const { success } = updateBody.safeParse(req.body)
    if (!success) {
        res.status(411).json({
            message: "Error while updating information"
        })
    }

		await User.updateOne({ _id: req.userId }, req.body);
	
    res.json({
        message: "Updated successfully"
    })
})

router.get('/search', auth, async (req, res) => {
    try {
        const searchName = req.query.usernam||""; // GET request => use query params


        if (!searchName) {
            return res.status(400).json({ msg: "Missing username query param" });
        }
        // const users = await User.find({
        //     $or: [
        //             {
        //                firstName: { "$regex": searchName }
        //             },
        //             {
        //                lastName: { "$regex": searchName }
        //             }
        //          ]
        // })
    
        // res.json({
        //     user: users.map(user => ({
        //         username: user.username,
        //         firstName: user.firstName,
        //         lastName: user.lastName,
        //         _id: user._id
        //     }))
        // })
        // Search using regex (case-insensitive)
        const users = await User.find({
            username: { $regex: searchName, $options: 'i' }
        });

        if (users.length > 0) {
            const searchUsers = users.map((user) => ({
                firstName: user.firstName,
                lastName: user.lastName
            }));
            return res.status(200).json({ searchUsers });
        } else {
            return res.status(404).json({ msg: "No users found" });
        }
    } catch (error) {
        return res.status(500).json({ msg: "Server error", error: error.message });
    }
});


module.exports =router