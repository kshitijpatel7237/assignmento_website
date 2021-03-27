var mongoose=require('mongoose');
mongoose.Promise = require('bluebird');
mongoose.Promise = require('q').Promise;
var router=require('router');

// schema

var sign_up_schema=mongoose.Schema(
	{
    name:{
		type:String
		
	},
    degree:{
		type:String
		
	},
	email:{
		type:String
		
		
		
	},
	mobile:{
		type:String
		
	},
	address:{
		type:String
		
	},
	password:{
		type:String
		
	}
	

	});

//model pdf:{
		//type:String,
		//required:true
	//},
mongoose.model('sign_up',sign_up_schema);

module.exports=mongoose.model('sign_up');

