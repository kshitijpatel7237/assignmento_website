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
var comment_model=require('../models/comments');

//pdf:req.file.originalname,
module.exports=function(req,res)
{
	 var name="";
   if(req.cookies.assignmento)
   name=req.cookies.assignmento;
	console.log(req.body);
comment_model.create({

link_of_playlist:req.body.link_of_playlist,
comments:req.body.comments,
user_name:name


},
function(err,result)
{
	if(err)
	{
		console.log("comment failed" + err);
		//res.send("data insertion failed status 500");
        
        return;
	}
	else
	{
		console.log("new_comment_posted");
 return;
	}
}
);
}

