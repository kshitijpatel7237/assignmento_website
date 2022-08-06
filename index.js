var express = require('express');
var app = express();
var path = require('path');
var fs = require('fs');
var bodyparser = require('body-parser')
var multer = require("multer")
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
mongoose.Promise = require('q').Promise;
var nodemailer = require('nodemailer');
var cookieParser = require('cookie-parser');
var jwt = require('jsonwebtoken');
var httpmsgs = require('http-msgs');
//var router=require('router')
var dbconn = require('./database/dbconn');
var url = require('url');
var session = require('express-session');
var sign_up_model = require('./database/models/sign_up');

// setting environment

app.set('port', process.env.PORT || 3000);

//setting view engine


app.set('view engine', 'ejs');


//code for local storage 


if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}




// setting body-parser and multer
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());
var upload = multer({ dest: '/tmp/uploads' })


// setting middlewares
app.use(cookieParser());
var origin = '/';


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



function check_login(req, res, next) {
  var token = localStorage.getItem('my_token');
  try {
    jwt.verify(token, 'login_token');
    next();
  } catch (err) {

    origin = req.path;
    if (req.path == '/find_all_pdfs')
      req.session.parameter = req.query.link;

    res.redirect('/login_page');



  }

}










app.use('/assets', express.static(path.join(__dirname, '/assets')));
app.get('/', check_login, function (req, res) {

  var name = "";
  if (req.cookies.assignmento)
    name = req.cookies.assignmento;

  res.render('index', { status: 1, name: name, message: "" });

});

app.get('/contribute', check_login, function (req, res) {
  var name = "";
  if (req.cookies.assignmento)
    name = req.cookies.assignmento;
  res.render('contribute', { name: name, message: "" });
});

app.get('/assignments', function (req, res) {
  req.session.destroy(function (error) {
    console.log("Session Destroyed")
  });
  res.render('assignments');

});

app.get('/sign-up', function (req, res) {
  res.render('sign-up.ejs');
});

app.get('/login_page', function (req, res) {
  res.render('login_page');

});

app.get('/article_editor', function (req, res) {
  var name = "";
  if (req.cookies.assignmento)
    name = req.cookies.assignmento;
  res.render('article_editor', { name: name, message: "" });

});





var storage = multer.diskStorage({
  destination: function (req, file, cb) {


    cb(null, path.join(__dirname, '/tmp/uploads'))
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now() + ".pdf")
  }
});
var submit_assignment = multer({
  storage: storage,

});
var add_new_problem = multer({
  storage: storage,

});

app.post('/add_new_problem', add_new_problem.single("file"), function (req, res) {
  console.log(req.body);
  var name = "";
  if (req.cookies.assignmento)
    name = req.cookies.assignmento;

  var fun = require(path.join(__dirname, '/database/controllers/setting_problem_controller'));
  fun(req, res);

  console.log(req.body);

  res.render('add_problem', { message: "problem added sucseesfully", name: name });


});
app.post('/submit_assignment', submit_assignment.single("file"), function (req, res) {
  var name = "";
  if (req.cookies.assignmento)
    name = req.cookies.assignmento;


  var contributeController = require(path.join(__dirname, '/database/controllers/contribute_controller'));
  var fun = contributeController.save;
  fun(req, res);



  res.render('contribute', { message: "assignment uploaded sucseesfully", name: name });


});
app.get('/admin', function (request, response) {
  var name = "";
  if (request.cookies.assignmento)
    name = request.cookies.assignmento;
  var contributeController = require(path.join(__dirname, '/database/controllers/contribute_controller'));
 var fun=contributeController.get;

  var res=fun();
  const promise1 = Promise.resolve(res);
  var res=""
promise1.then((result)=>{
  
  res=result;
 // console.log( res[0]._id+" and "+typeof result[0]._id);

  response.render('admin_dashboard', { data: res, name: name });
},(err)=>{
  console.log(err);
});


});

app.get('/approve',function(req,res){
  var name = "";
  if (req.cookies.assignmento)
    name = req.cookies.assignmento;

    
  var contributeController = require(path.join(__dirname, '/database/controllers/contribute_controller'));
  var fun = contributeController.update;
  var tmp=fun(req.query.document_id);
  console.log( req.query.document_id);
  const promise1 = Promise.resolve(tmp);
  promise1.then((result)=>{
   console.log( result);
   
    res.redirect('/admin');
  },(err)=>{
    console.log(err);
  });

 

 

});
app.post('/find_pdfs', function (req, res) {
  var key = req.body.link;

  var MongoClient = require('mongodb').MongoClient;
  var url = "mongodb+srv://user:ApKp@7237046763@cluster0.71j4n.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
  //"mongodb://localhost:27017/" || 
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("myFirstDatabase");
    var query = { link_of_playlist: key ,isApproved:"YES"};
    dbo.collection("contributes").find(query).limit(2).toArray(function (err, result) {
      if (err) throw err;

      httpmsgs.sendJSON(req, res, {
        data: result
      });
      db.close();

    });
  });
});

app.get('/update_user_data', check_login, function (req, res) {
  var name = "";
  if (req.cookies.assignmento)
    name = req.cookies.assignmento;
  var contributeController = require(path.join(__dirname, '/database/controllers/contribute_controller'));
  var fun = contributeController.save;
  fun(req, res);

});



app.get('/find_all_pdfs', check_login, function (req, res) {
  var key = "";

  var name = "";
  if (req.cookies.assignmento)
    name = req.cookies.assignmento;

  if (req.session.parameter)
    key = req.session.parameter;
  else
    key = req.query.link;

  var MongoClient = require('mongodb').MongoClient;
  var url = "mongodb+srv://user:ApKp@7237046763@cluster0.71j4n.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
  //"mongodb://localhost:27017/" || 
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("myFirstDatabase");
    var query = { link_of_playlist: key,isApproved:"YES"};
    var comments;
    dbo.collection("comments").find(query).toArray(function (err, result) {
      if (err) throw err;


      result.reverse();
      comments = result;




    });

    dbo.collection("contributes").find(query).toArray(function (err, result) {
      if (err) throw err;


      res.render('assignments', { data: result, comments: comments, name: name });




    });
  });
});









app.post('/new_user_sign_up', function (req, res) {

  var token = jwt.sign({ email: req.body.email, password: req.body.password }, 'login_token');
  localStorage.setItem('my_token', token);

  var fun = require(path.join(__dirname, '/database/controllers/sign_up_controller'));
  fun(req, res);


  res.cookie('assignmento', req.body.name, {
    maxAge: 6912000000,
    httpOnly: true
  });
  res.cookie('degree', req.body.degree, {
    maxAge: 6912000000,
    httpOnly: true
  });
  res.cookie('email', req.body.email, {
    maxAge: 6912000000,
    httpOnly: true
  });
  res.cookie('mobile', req.body.mobile, {
    maxAge: 6912000000,
    httpOnly: true
  });
  res.cookie('address', req.body.address, {
    maxAge: 6912000000,
    httpOnly: true
  });


  var tmp = origin;
  res.redirect(tmp);

});

app.post('/user_login', function (req, res) {
  //generating token

  var token = jwt.sign({ email: req.body.email, password: req.body.password }, 'login_token');
  localStorage.setItem('my_token', token);

  var MongoClient = require('mongodb').MongoClient;
  var url = "mongodb+srv://user:ApKp@7237046763@cluster0.71j4n.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
  //"mongodb://localhost:27017/" || 
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("myFirstDatabase");
    var email = req.body.email;
    var password = req.body.password;

    var query = { email: email, password: password };
    dbo.collection("sign_ups").find(query).toArray(function (err, result) {
      if (err) throw err;


      if (result.length != 0) {
        res.cookie('assignmento', result[0].name, {
          maxAge: 6912000000,
          httpOnly: true
        });


        var tmp = origin;
        origin = "/";


        res.redirect(tmp)



      }
      else {

        res.render('index', { status: 0, name: "", message: "Login Failed" });
      }


    });
  });

});

app.get('/logout', (req, res) => {
  //it will clear the userData cookie
  req.session.destroy(function (error) {
    console.log("Session Destroyed")
  });

  localStorage.removeItem('my_token');
  res.clearCookie('assignmento');


  res.render('index', { status: 1, name: "", message: "" });
});

app.post('/send_mail', function (req, res) {
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
    text: req.body.name + " :" + req.body.msg
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });

  res.render('index', { status: 0, name: req.cookies.assignmento, message: "Email Sent " });
});




app.post('/post_comments', function (req, res) {
  var key = req.body.link_of_playlist;



  var MongoClient = require('mongodb').MongoClient;
  var url = "mongodb+srv://user:ApKp@7237046763@cluster0.71j4n.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
  //"mongodb://localhost:27017/" || 

  var fun = require(path.join(__dirname, '/database/controllers/comment_controller'));
  fun(req, res);
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("myFirstDatabase");
    var query = { link_of_playlist: key };
    dbo.collection("comments").find(query).limit(50).toArray(function (err, result) {
      if (err) throw err;

      httpmsgs.sendJSON(req, res, {
        data: result
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


app.get('/success', function (req, res) {
  console.log(userProfile);
  console.log(userProfile.id + " " + userProfile.displayName + " " + userProfile.emails[0].value);
  var token = jwt.sign({ email: userProfile.id, password: userProfile.displayName }, 'login_token');
  localStorage.setItem('my_token', token);

  sign_up_model.create({
    name: userProfile.displayName,
    degree: 'logged in with gmail',
    email: userProfile.emails[0].value,
    mobile: 'logged in with gmail',
    address: 'na',
    password: userProfile.id
  },
    function (err, result) {
      if (err) {
        console.log("insertion failed" + err);
        //res.send("data insertion failed status 500");

        return;
      }
      else {
        console.log("insertion successfull");
        return;
      }
    }
  );





  res.cookie('assignmento', userProfile.displayName, {
    maxAge: 6912000000,
    httpOnly: true
  });

  //res.render('index',{status:1,name:req.body.name,message:'Sign Up sucessfull'});
  var tmp = origin;
  res.redirect(tmp);

});

app.get('/error', (req, res) => res.send("error logging in"));

passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
  cb(null, obj);
});







/*  Google AUTH  */

const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const GOOGLE_CLIENT_ID = '415088139205-d2iq1ihj5irrbitvae96f4k9aoi1qbv6.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = "uGiR9Kw_QuzJjiSKYIM5I7Je";
// const GOOGLE_CLIENT_ID = '270555561170-cj221t5vp9i1k49avt1luba9gf2f3793.apps.googleusercontent.com';
// const GOOGLE_CLIENT_SECRET ="DvQbZA0wtIEzya4Jv1xYwGBv";
passport.use(new GoogleStrategy({
  clientID: '415088139205-d2iq1ihj5irrbitvae96f4k9aoi1qbv6.apps.googleusercontent.com',
  clientSecret: 'uGiR9Kw_QuzJjiSKYIM5I7Je',
  //    clientID:'270555561170-cj221t5vp9i1k49avt1luba9gf2f3793.apps.googleusercontent.com',
  // clientSecret:'DvQbZA0wtIEzya4Jv1xYwGBv',

  //callbackURL:"http://localhost:3000/auth/google/callback"
  callbackURL: "https://assignmento.herokuapp.com/auth/google/callback"
},
  function (accessToken, refreshToken, profile, done) {
    userProfile = profile;
    return done(null, userProfile);
  }
));

app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/error' }),
  function (req, res) {
    // Successful authentication, redirect success.
    res.redirect('/success');
  });

// callbackURL: "https://assignmento.herokuapp.com/auth/google/callback"



app.get('/problem_page', function (req, res) {
  var name = "";
  if (req.cookies.assignmento)
    name = req.cookies.assignmento;
  res.render('problem_page', { name: name, message: "" });

});

app.get('/add_problem', function (req, res) {
  var name = "";
  if (req.cookies.assignmento)
    name = req.cookies.assignmento;
  res.render('add_problem', { name: name, message: "" });

});








app.listen(app.get('port'), function () {
  console.log("app is running ");
});