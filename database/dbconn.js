

var mongoose=require('mongoose');
var assert=require('assert');
var url = "mongodb+srv://user:ApKp@7237046763@cluster0.71j4n.mongodb.net/myFirstDatabase?retryWrites=true&w=majority" ;
//var url="mongodb+srv://Kshitij_:<ApKp@7237046763>@cluster0.yv5zi.mongodb.net/kshitij_?retryWrites=true&w=majority";
//"mongodb://localhost:27017/assignmento" || 
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
		if(err)
			console.log(err);
		
		console.log("connection success");
		

	}
	);