
var express=require('express')
var app=express();
var path=require('path')
var multer=require('multer');
var fs=require('fs');
var {check,validationResult}=require('express-validator')
var sign_up_model=require('../models/sign_up');
//pdf:req.file.originalname,
module.exports=function(req,res)
{
	//console.log(req.file);
sign_up_model.create({
name:req.body.name,
degree:req.body.degree,
email:req.body.email,
mobile:req.body.mobile,
address:req.body.address,
password:req.body.password
},
function(err,result)
{
	if(err)
	{
		console.log("insertion failed" + err);
		//res.send("data insertion failed status 500");
        
        return;
	}
	else
	{
		console.log("insertion successfull");
 return;
	}
}
);
}

