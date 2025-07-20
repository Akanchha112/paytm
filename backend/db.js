const mongoose= require('mongoose');

mongoose.connect('mongodb+srv://sakanchha111:xwI5Bc6GJjSrGA7O@cluster0.q8tbgls.mongodb.net/', { useNewUrlParser: true, useUnifiedTopology: true })
.then(()=>console.log("connected to mongoose"))
.catch(err=>console.log("coudn't connect to the server ",err))

// backend/db.js
// const mongoose = require('mongoose');

// Create a Schema for Users
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        minLength: 3,
        maxLength: 30
    },
    password: {
        type: String,
        required: true,
        minLength: 6
    },
    firstName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    }
});

// Create a model from the schema
const User = mongoose.model('User', userSchema);

const accountSchema=new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId, // Reference to User model
        ref: 'User',
        required: true
    },
    balance: {
        type: Number,
        required: true
    }
})

const Account = mongoose.model('Account', accountSchema);

module.exports = {User, Account};