const express=require('express')

const app=new express();

app.route('/',(req,res)=>{
    console.log(<h1>hello world</h1>);
});

app.listen(3000,()=>{
    console.log("Server is running at port 3000");
})