var express=require('express')
var app=express();
var path=require('path')
var fs = require('fs');
var bodyparser=require('body-parser')
var multer = require("multer")
var mongoose=require('mongoose');
mongoose.Promise = require('bluebird');
mongoose.Promise = require('q').Promise;
var nodemailer = require('nodemailer');
var cookieParser = require('cookie-parser');

//var router=require('router')
var dbconn=require('./routs/dbconn');

// setting environment

app.set('port',process.env.PORT || 3000);

//setting view engine


app.set('view engine', 'ejs');

// setting body-parser and multer
app.use(bodyparser.urlencoded({extended:true})); 
app.use(bodyparser.json()) ;
var upload = multer({dest : '/tmp/uploads'})  


// setting middlewares
app.use(cookieParser());

// app.use(express.static(path.join(__dirname, '/assets'))) 

// setting routs

app.use('/assets', express.static(path.join(__dirname, '/assets')));
app.get('/',function(req,res)
{
console.log(req.cookies);
    var name="";
   name=req.cookies.assignmento;
  console.log(name);
  //var status=req.cookies.status;
  //if(name!="")
	res.render('index',{status:1,name:name,message:""});
//else
 // res.render('index',{status:0,name:"",message:""});
});

app.get('/contribute',function(req,res)
{
res.render('contribute',{message:""});
});

app.get('/assignments',function(req,res)
{
res.render('assignments');
});

app.get('/sign-up',function(req,res)
  {
    res.render('sign-up.ejs');
  });





var storage = multer.diskStorage({ 
    destination: function (req, file, cb) { 
  
        // Uploads is the Upload_folder_name 
        cb(null, path.join(__dirname, '/tmp/uploads')) 
    }, 
    filename: function (req, file, cb) { 
      cb(null, file.fieldname + "-" + Date.now()+".pdf") 
    } 
  }) ;
var submit_assignment = multer({  
    storage: storage, 
    
});


app.post('/submit_assignment',submit_assignment.single("file"),function(req,res)
{
  

  console.log(req.file);
var fun=require(path.join(__dirname, '/routs/controllers/contribute_controller'));
 fun(req,res);
 
console.log(req.body);

res.render('contribute',{message: "assignment uploaded sucseesfully"});


});
app.post('/find_pdfs',function(req,res)
  {
    var key=req.body.search_key;
    console.log(key);
    var MongoClient = require('mongodb').MongoClient;
var url ="mongodb+srv://user:ApKp@7237046763@cluster0.71j4n.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
//"mongodb://localhost:27017/" || 
MongoClient.connect(url,  function(err, db) {
  if (err) throw err;
  var dbo = db.db("myFirstDatabase");
   var query = {link_of_playlist:key};
   dbo.collection("contributes").find(query).toArray(function(err, result) {
    if (err) throw err;
    console.log(result);
   

    res.render('assignments',{data:result});
    db.close();

  });
});
  });

app.post('/new_user_sign_up',function(req,res)
{
  

  console.log("signup "+req.body);
var fun=require(path.join(__dirname, '/routs/controllers/sign_up_controller'));
 fun(req,res);
 
//console.log(req.body);

res.render('index',{status:1,name:req.body.name,message:'Sign Up sucessfull'});

});

app.post('/user_login',function(req,res)
{
  

  // var key=req.body.search_key;
    console.log(req.body);
    var MongoClient = require('mongodb').MongoClient;
var url ="mongodb+srv://user:ApKp@7237046763@cluster0.71j4n.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
//"mongodb://localhost:27017/" || 
MongoClient.connect(url,  function(err, db) {
  if (err) throw err;
  var dbo = db.db("myFirstDatabase");
  var email=req.body.email;
  var password=req.body.password;
  console.log(email);
  console.log(password);
   var query = {email:email,password:password};
   dbo.collection("sign_ups").find(query).toArray(function(err, result) {
    if (err) throw err;
    console.log(result);
   
if(result.length!=0)
{
  res.cookie('assignmento',result[0].name,{
    expire: new Date(400035500 + Date.now()),
httpOnly:true
  });
  //console.log(req.cookie);
res.render('index',{status:1,name:result[0].name,message:"login Success"});
    db.close();

}
else
{
 
  res.render('index',{status:0,name:"",message:"Login Failed"});
}
    

  });
});


 
//console.log(req.body);
//res.send("sign_up_sucessfully");


});

app.post('/send_mail',function(req,res)
  {
    console.log(req.body);
var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'kshitij7237046763@gmail.com',
    pass: 'Kshitij@123'
  }
});

var mailOptions = {
  from: 'kshitij7237046763@gmail.com',
  to: 'kshitijpatel917050@gmail.com',
  subject: 'email from assignmento user',
  text:req.body.name+" :"+req.body.msg
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});

 res.render('index',{status:0,name:"",message:"Email Sent"});
  });

app.listen(app.get('port'),function(){
	console.log("app is running ");
});