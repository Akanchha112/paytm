const express = require("express");
const mainRouter=require('./routes/index');

const app=express();


app.use("/api/v1/",mainRouter);

app.listen(3001,()=>{
    console.log("Server is running at port 3001");
})
