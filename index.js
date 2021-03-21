var express=require('express')
var app=express();
var path=require('path')
var fs = require('fs');
var bodyparser=require('body-parser')
var multer = require("multer")
var mongoose=require('mongoose');
mongoose.Promise = require('bluebird');
mongoose.Promise = require('q').Promise;
//var router=require('router')
var dbconn=require('./routs/dbconn');

// setting environment

app.set('port',process.env.PORT || 3000);

//setting view engine


app.set('view engine', 'ejs');

// setting body-parser and multer
app.use(bodyparser.urlencoded({extended:true})); 
app.use(bodyparser.json()) ;
var upload = multer({dest : '../uploas/pdfs'})  


// setting middlewares


app.use(express.static(path.join(__dirname, '/assets'))) 

// setting routs


app.get('/',function(req,res)
{

  
	res.render('index');
});

app.get('/contribute',function(req,res)
{
res.render('contribute');
});

app.get('/assignments',function(req,res)
{
res.render('assignments');
});

var storage = multer.diskStorage({ 
    destination: function (req, file, cb) { 
  
        // Uploads is the Upload_folder_name 
        cb(null, path.join(__dirname, '/uploads/pdfs')) 
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
res.send(req.body );


});
app.post('/find_pdfs',function(req,res)
  {
    var key=req.body.search_key;
    console.log(key);
    var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

MongoClient.connect(url,  function(err, db) {
  if (err) throw err;
  var dbo = db.db("assignmento");
   var query = {link_of_playlist:key};
   dbo.collection("contributes").find(query).toArray(function(err, result) {
    if (err) throw err;
    console.log(result);
   

    res.render('assignments',{data:result});
    db.close();

  });
});
  });

app.listen(app.get('port'),function(){
	console.log("app is running ");
});