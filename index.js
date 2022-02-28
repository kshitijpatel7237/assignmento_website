var express=require('express');
var app=express();
var path=require('path');
var fs = require('fs');
var bodyparser=require('body-parser')
var multer = require("multer")
var mongoose=require('mongoose');
mongoose.Promise = require('bluebird');
mongoose.Promise = require('q').Promise;
var nodemailer = require('nodemailer');
var cookieParser = require('cookie-parser');
var jwt=require('jsonwebtoken');
var httpmsgs=require('http-msgs');
//var router=require('router')
var dbconn=require('./routs/dbconn');
var url=require('url');
var session=require('express-session');
var sign_up_model=require('./routs/models/sign_up');

// setting environment

app.set('port',process.env.PORT || 3000);

//setting view engine


app.set('view engine', 'ejs');


//code for local storage 


if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}




// setting body-parser and multer
app.use(bodyparser.urlencoded({extended:true})); 
app.use(bodyparser.json()) ;
var upload = multer({dest : '/tmp/uploads'})  


// setting middlewares
app.use(cookieParser());
var origin='/';


app.use(session({
  
    // It holds the secret key for session
    secret: 'Your_Secret_Key',
  
    // Forces the session to be saved
    // back to the session store
    resave: true,
  
    // Forces a session that is "uninitialized"
    // to be saved to the store
    saveUninitialized: true
}))



function check_login(req,res,next)
{
  var token=localStorage.getItem('my_token');
  try {
  jwt.verify(token, 'login_token');
  next();
} catch(err) {
 //res.render('index',{status:1,name:"",message:"please login first"});
//console.log(err);
origin=req.path;
if(req.path=='/find_all_pdfs')
req.session.parameter=req.query.link;

res.redirect('/login_page');



}

}

// app.use(express.static(path.join(__dirname, '/assets'))) 

// setting routs









app.use('/assets', express.static(path.join(__dirname, '/assets')));
app.get('/',check_login,function(req,res)
{
//console.log(req.cookies);
    var name="";
   if(req.cookies.assignmento)
   name=req.cookies.assignmento;
  //console.log(name);
  //var status=req.cookies.status;
  //if(name!="")
	res.render('index',{status:1,name:name,message:""});
//else
 // res.render('index',{status:0,name:"",message:""});
});

app.get('/contribute',check_login,function(req,res)
{
   var name="";
   if(req.cookies.assignmento)
   name=req.cookies.assignmento;
res.render('contribute',{name:name,message:""});
});

app.get('/assignments',function(req,res)
{
  req.session.destroy(function(error){
        console.log("Session Destroyed")
    });
res.render('assignments');

});

app.get('/sign-up',function(req,res)
  {
    res.render('sign-up.ejs');
  });

app.get('/login_page',function(req,res)
  {
    res.render('login_page');
    
  });

app.get('/article_editor',function(req,res)
  {
    var name="";
   if(req.cookies.assignmento)
   name=req.cookies.assignmento;
    res.render('article_editor',{name:name,message:""});
    
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
var add_new_problem = multer({  
    storage: storage, 
    
});

app.post('/add_new_problem',add_new_problem.single("file"),function(req,res)
{
  console.log(req.body);
  var name="";
   if(req.cookies.assignmento)
   name=req.cookies.assignmento;

 // console.log(req.file);
var fun=require(path.join(__dirname, '/routs/controllers/setting_problem_controller'));
 fun(req,res);
 
console.log(req.body);

res.render('add_problem',{message: "problem added sucseesfully",name:name});


});
app.post('/submit_assignment',submit_assignment.single("file"),function(req,res)
{
  var name="";
   if(req.cookies.assignmento)
   name=req.cookies.assignmento;

 // console.log(req.file);
var fun=require(path.join(__dirname, '/routs/controllers/contribute_controller'));
 fun(req,res);
 
//console.log(req.body);

res.render('contribute',{message: "assignment uploaded sucseesfully",name:name});


});
app.post('/find_pdfs',function(req,res)
  {
    var key=req.body.link;
    //search_key
   // console.log(key);
    var MongoClient = require('mongodb').MongoClient;
var url ="mongodb+srv://user:ApKp@7237046763@cluster0.71j4n.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
//"mongodb://localhost:27017/" || 
MongoClient.connect(url,  function(err, db) {
  if (err) throw err;
  var dbo = db.db("myFirstDatabase");
   var query = {link_of_playlist:key};
   dbo.collection("contributes").find(query).limit(2).toArray(function(err, result) {
    if (err) throw err;
   //console.log(result);
   

   // res.render('assignments',{data:result});
  // res.send(result);
  httpmsgs.sendJSON(req,res,{
    data:result
  });
    db.close();

  });
});
  });



  

app.get('/find_all_pdfs',check_login,function(req,res)
  {
    var key="";
    
   var name="";
   if(req.cookies.assignmento)
   name=req.cookies.assignmento;
     
     if(req.session.parameter)
      key=req.session.parameter;
    else
      key=req.query.link;
   // console.log("s"+req.session.parameter)
    //search_key
   // console.log(key);
    var MongoClient = require('mongodb').MongoClient;
var url ="mongodb+srv://user:ApKp@7237046763@cluster0.71j4n.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
//"mongodb://localhost:27017/" || 
MongoClient.connect(url,  function(err, db) {
  if (err) throw err;
  var dbo = db.db("myFirstDatabase");
   var query = {link_of_playlist:key};
   var comments;
    dbo.collection("comments").find(query).toArray(function(err, result) {
    if (err) throw err;
   
//console.log(result);
result.reverse();
    comments=result;
  // res.send(result);
  
    

  });

   dbo.collection("contributes").find(query).toArray(function(err, result) {
    if (err) throw err;
   
//console.log(result);
    res.render('assignments',{data:result,comments:comments,name:name});
  // res.send(result);
  
    

  });
});
  });









app.post('/new_user_sign_up',function(req,res)
{
  
var token = jwt.sign({email: req.body.email,password:req.body.password}, 'login_token');
  localStorage.setItem('my_token', token);
  //console.log("signup "+req.body);
var fun=require(path.join(__dirname, '/routs/controllers/sign_up_controller'));
 fun(req,res);
 
//console.log(req.body);
res.cookie('assignmento',req.body.name,{
     maxAge:6912000000,
httpOnly:true
  });
res.cookie('degree',req.body.degree,{
     maxAge:6912000000,
httpOnly:true
  });
res.cookie('email',req.body.email,{
     maxAge:6912000000,
httpOnly:true
  });
res.cookie('mobile',req.body.mobile,{
     maxAge:6912000000,
httpOnly:true
  });
res.cookie('address',req.body.address,{
     maxAge:6912000000,
httpOnly:true
  });

//res.render('index',{status:1,name:req.body.name,message:'Sign Up sucessfull'});
var tmp=origin;
res.redirect(tmp);
  
});

app.post('/user_login',function(req,res)
{
  //generating token

  var token = jwt.sign({email: req.body.email,password:req.body.password}, 'login_token');
  localStorage.setItem('my_token', token);
  // var key=req.body.search_key;
  //  console.log(req.body);
    var MongoClient = require('mongodb').MongoClient;
var url ="mongodb+srv://user:ApKp@7237046763@cluster0.71j4n.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
//"mongodb://localhost:27017/" || 
MongoClient.connect(url,  function(err, db) {
  if (err) throw err;
  var dbo = db.db("myFirstDatabase");
  var email=req.body.email;
  var password=req.body.password;
 // console.log(email);
 // console.log(password);
   var query = {email:email,password:password};
   dbo.collection("sign_ups").find(query).toArray(function(err, result) {
    if (err) throw err;
   // console.log(result);
   
if(result.length!=0)
{
  res.cookie('assignmento',result[0].name,{
     maxAge:6912000000,
httpOnly:true
  });

  //console.log(req.cookie);
  var tmp=origin;
  origin="/";

//res.render(tmp,{status:1,name:result[0].name,message:"login Success"});
res.redirect(tmp)
    //db.close();


}
else
{
 
  res.render('index',{status:0,name:"",message:"Login Failed"});
}
    

  });
});

});

app.get('/logout', (req, res)=>{
//it will clear the userData cookie
req.session.destroy(function(error){
        console.log("Session Destroyed")
    });

localStorage.removeItem('my_token');
res.clearCookie('assignmento');

//res.send('user logout successfully');
res.render('index',{status:1,name:"",message:""});
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

 res.render('index',{status:0,name:req.cookies.assignmento,message:"Email Sent "});
  });




app.post('/post_comments',function(req,res)
  {
    var key=req.body.link_of_playlist;
    //search_key
   // console.log(key);


    var MongoClient = require('mongodb').MongoClient;
var url ="mongodb+srv://user:ApKp@7237046763@cluster0.71j4n.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
//"mongodb://localhost:27017/" || 

var fun=require(path.join(__dirname, '/routs/controllers/comment_controller'));
 fun(req,res);
MongoClient.connect(url,  function(err, db) {
  if (err) throw err;
  var dbo = db.db("myFirstDatabase");
   var query = {link_of_playlist:key};
   dbo.collection("comments").find(query).limit(50).toArray(function(err, result) {
    if (err) throw err;
   //console.log(result);
   

   // res.render('assignments',{data:result});
   //res.send(result);
  httpmsgs.sendJSON(req,res,{
    data:result
  });
    db.close();

  });
});
  });






/*  PASSPORT SETUP  */

const passport = require('passport');
var userProfile;

app.use(passport.initialize());
app.use(passport.session());

//app.set('view engine', 'ejs');
//app.get('/success', (req, res) => res.send(userProfile));

app.get('/success',function(req,res)
{
  console.log(userProfile);
  console.log(userProfile.id+" "+userProfile.displayName+" "+userProfile.emails[0].value);
  var token = jwt.sign({email: userProfile.id,password:userProfile.displayName}, 'login_token');
  localStorage.setItem('my_token', token);
  //console.log("signup "+req.body);
// var fun=require(path.join(__dirname, '/routs/controllers/sign_up_controller'));
//  fun(req,res);
//conole.log('ya');

 
//console.log(req.body);
sign_up_model.create({
name:userProfile.displayName,
degree:'logged in with gmail',
email:userProfile.emails[0].value,
mobile:'logged in with gmail',
address:'na',
password:userProfile.id
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





res.cookie('assignmento',userProfile.displayName,{
     maxAge:6912000000,
httpOnly:true
  });

//res.render('index',{status:1,name:req.body.name,message:'Sign Up sucessfull'});
var tmp=origin;
res.redirect(tmp);
  
});

app.get('/error', (req, res) => res.send("error logging in"));

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});







/*  Google AUTH  */
 
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const GOOGLE_CLIENT_ID = '415088139205-d2iq1ihj5irrbitvae96f4k9aoi1qbv6.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET ="uGiR9Kw_QuzJjiSKYIM5I7Je";
// const GOOGLE_CLIENT_ID = '270555561170-cj221t5vp9i1k49avt1luba9gf2f3793.apps.googleusercontent.com';
// const GOOGLE_CLIENT_SECRET ="DvQbZA0wtIEzya4Jv1xYwGBv";
passport.use(new GoogleStrategy({
    clientID:'415088139205-d2iq1ihj5irrbitvae96f4k9aoi1qbv6.apps.googleusercontent.com',
    clientSecret:'uGiR9Kw_QuzJjiSKYIM5I7Je',
  //    clientID:'270555561170-cj221t5vp9i1k49avt1luba9gf2f3793.apps.googleusercontent.com',
  // clientSecret:'DvQbZA0wtIEzya4Jv1xYwGBv',

  //callbackURL:"http://localhost:3000/auth/google/callback"
   callbackURL: "https://assignmento.herokuapp.com/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
      userProfile=profile;
      return done(null, userProfile);
  }
));
 
app.get('/auth/google', 
  passport.authenticate('google',{ scope:['profile', 'email'] }));
 
app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/error' }),
  function(req, res) {
    // Successful authentication, redirect success.
    res.redirect('/success');
  });

// callbackURL: "https://assignmento.herokuapp.com/auth/google/callback"



app.get('/problem_page',function(req,res)
  {
    var name="";
   if(req.cookies.assignmento)
   name=req.cookies.assignmento;
    res.render('problem_page',{name:name,message:""});
    
  });

app.get('/add_problem',function(req,res)
  {
    var name="";
   if(req.cookies.assignmento)
   name=req.cookies.assignmento;
    res.render('add_problem',{name:name,message:""});
    
  });








app.listen(app.get('port'),function(){
	console.log("app is running ");
});