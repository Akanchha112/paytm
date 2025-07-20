const express = require("express");
const userRouter=require('./user')
const accountRputer=require('./account')
const router= express.Router();


router.use('/user',userRouter);
router.use('/account',accountRputer);

module.exports =router

