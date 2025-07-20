const express = require("express");
const cors= require('cors');
const mainRouter=require('./routes/index');

const app=express();
app.use(cors())

app.use(express.json()); //to directly use req.body

app.use("/api/v1/",mainRouter);

app.listen(3001,()=>{
    console.log("Server is running at port 3001");
})
