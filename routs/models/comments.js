var mongoose=require('mongoose');
mongoose.Promise = require('bluebird');
mongoose.Promise = require('q').Promise;
var router=require('router');

// schema

var comment_schema=mongoose.Schema(
	{
   
	
	
	link_of_playlist:{
		type:String
	},
	comments:{
		type:String
	}
	

	});

//model pdf:{
		//type:String,
		//required:true
	//},
mongoose.model('comments',comment_schema);

module.exports=mongoose.model('comments');

