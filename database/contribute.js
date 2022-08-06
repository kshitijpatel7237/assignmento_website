
var multer=require('multer');
var fs=require('fs');
var path=require('path');
var contribute=require('./../controllers/')
   
module.exports = function(req,res){ 
  console.log("inside contribue"); 
     console.log(req.body);
     console.log(req.file);
	var name = req.body.name;
   console.log(name);
 

}