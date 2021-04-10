// var express = require("express")
// var multer = require("multer")

// var app = express()
// app.post('/contribute.js', (req, res) => {
//   const name = req.body.name
//   console.log(name);
  
//   res.end();
// })
// var storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/pdfs")
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + "-" + file.originalname)
 // },
//})
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
  // fs.rename(req.file.path, './uploads/pdfs/avatar', (err)=>{ 
       // console.log(err); 
//}); 
//var dbconn=require('./dbconn');
//dbconn();

}