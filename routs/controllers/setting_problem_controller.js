
var express=require('express')
var app=express();
var path=require('path')
var multer=require('multer');
var fs=require('fs');
var {check,validationResult}=require('express-validator')
var problem_model=require('../models/problems');
module.exports=function(req,res)
{
	console.log(req.body);
problem_model.create({
problem_id:req.body.problem_id,
contest_id:req.body.contest_id,
problem_name:req.body.problem_name,
problem_text:req.body.problem_text,
problem_setter_name:req.body.problem_setter,
total_submissions:req.body.total_submissions,
correct_submissions:req.body.correct_submissions,
topic_tag:req.body.topic_tag
},
function(err,result)
{
	if(err)
	{
		console.log("problem setting failed" + err);
		//res.send("data insertion failed status 500");
        
        return;
	}
	else
	{
		console.log("problem succesfully added");
 return;
	}
}
);
}

