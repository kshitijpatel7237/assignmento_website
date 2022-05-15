
var express=require('express')
var app=express();
var path=require('path')
var multer=require('multer');
var fs=require('fs');
var {check,validationResult}=require('express-validator')
var contribute_model=require('../models/contribute');
module.exports=function(req,res)
{
contribute_model.create({
name:req.body.name,
degree:req.body.degree,
email:req.body.email,
mobile:req.body.mobile,
address:req.body.address,
subject:req.body.subject,
chapter:req.body.chapter,
topic:req.body.topic,
number_of_ques:req.body.no_of_ques,
channel_name:req.body.channel,
link_of_playlist:req.body.link_of_playlist,

drive_link:req.body.drive_link,
mark_down:req.body.mark_down
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

