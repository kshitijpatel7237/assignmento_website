
var express = require('express')
var app = express();
var path = require('path')
var multer = require('multer');
var fs = require('fs');
var { check, validationResult } = require('express-validator')
var contribute_model = require('../models/contribute');
// module.exports=function(req,res)
// {
// contribute_model.create({
// name:req.body.name,
// degree:req.body.degree,
// email:req.body.email,
// mobile:req.body.mobile,
// address:req.body.address,
// subject:req.body.subject,
// chapter:req.body.chapter,
// topic:req.body.topic,
// number_of_ques:req.body.no_of_ques,
// channel_name:req.body.channel,
// link_of_playlist:req.body.link_of_playlist,

// drive_link:req.body.drive_link,
// mark_down:req.body.mark_down
// },
// function(err,result)
// {
// 	if(err)
// 	{
// 		console.log("insertion failed" + err);
// 		//res.send("data insertion failed status 500");

//         return;
// 	}
// 	else
// 	{
// 		console.log("insertion successfull");
//  return;
// 	}
// }
// );
// }


module.exports = {
	save: (req,res) => {
		var md = new contribute_model();
		md.name = req.body.name;
		md.degree = req.body.degree;
		md.email = req.body.email;
		md.mobile = req.body.mobile;
		md.address = req.body.address;
		md.subject = req.body.subject;
		md.chapter = req.body.chapter;
		md.topic = req.body.topic;
		md.number_of_ques = req.body.no_of_ques;
		md.channel_name = req.body.channel;
		md.link_of_playlist = req.body.link_of_playlist;

		md.drive_link = req.body.drive_link;
		md.mark_down = req.body.mark_down;
		md.save(function (err, data) {
			if (err) {
				console.log(error);
			}
			else {
				console.log("Data inserted");
			}
		});
	},
	update:async (id)=>{
		var md = new contribute_model();
		return contribute_model.findByIdAndUpdate(id, 
			{isApproved:"YES"}, function(err, data) {
				if(err){
					console.log(err);
					return false;
				}
				else{
					
					console.log("Data updated!");
					return true;
				}
			});  
	},
	get:async ()=>{
        
		  res=await contribute_model.find({isApproved:"NA"});
		
		return res;
		 
	
	}

}

