
// module.exports=function()
// {
// 	var MongoClient = require('mongodb').MongoClient;
// var url = "mongodb://localhost:27017/assignmento";

// MongoClient.connect(url, function(err, db) {
//   if (err) throw err;
//   var dbo = db.db("assignmento");
//   dbo.collection("customers").find({}).toArray(function(err, result) {
//     if (err) throw err;
//     console.log(result);
//     db.close();
//   });
  
// });
// }

var mongoose=require('mongoose');
var assert=require('assert');
var url = "mongodb://localhost:27017/assignmento" || "mongodb+srv://user:ApKp@7237046763@cluster0.71j4n.mongodb.net/myFirstDatabase?retryWrites=true&w=majority" ;

// connection code
module.exports=mongoose.connect(
	url,
	{
		useNewUrlParser:true,
		useUnifiedTopology:true,
		useCreateIndex:true
	},
	function(err,link)
	{
		assert.equal(err,null,"conncetion failed");
		console.log("connection success");
		console.log(link);

	}
	);