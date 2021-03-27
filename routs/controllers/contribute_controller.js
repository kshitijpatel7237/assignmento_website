// var mongoose=require('mongoose');
// const Contribute_schema=mongoose.Schema({
// 	name:{
// 		type:String,
// 		required:true
// 	}
// 	degree:{
// 		type:String,
// 		required:true
// 	}
// 	email:{
// 		type:String,
// 		required:true
// 	}
// 	mobile:{
// 		type:String,
// 		required:true
// 	}
// 	address:{
// 		type:String,
// 		required:true
// 	}
// 	subject:{
// 		type:String,
// 		required:true
// 	}
// 	chapter:{
// 		type:String,
// 		required:true
// 	}
// 	topic:{
// 		type:String,
// 		required:true
// 	}
// 	number_of_ques:{
// 		type:Number,
// 		required:true
// 	}
// 	channel_name:{
// 		type:String,
// 		required:true
// 	}
// 	link_of_playlist:{
// 		type:String,
// 		required:true
// 	}
// 	pdf:{
// 		type:String,
// 		required:true
// 	}

// });
// //model
// mongoose.model('Assignmento',Contribute_schema);
// module.exports=mongoose.model('Assignmento');
var express=require('express')
var app=express();
var path=require('path')
var multer=require('multer');
var fs=require('fs');
var {check,validationResult}=require('express-validator')
var contribute_model=require('../models/contribute');
//pdf:req.file.originalname,
module.exports=function(req,res)
{
	//console.log(req.file);
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

drive_link:req.body.drive_link
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

