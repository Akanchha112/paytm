const express= require('express')
const router= express.Router();

router.get('/signup',(req,res,next)=>{
    console.log("hello world");
    res.send("hello world");
});


module.exports =router