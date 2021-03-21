var mongoose=require('mongoose');
mongoose.Promise = require('bluebird');
mongoose.Promise = require('q').Promise;
var router=require('router');

// schema

var contribute_schema=mongoose.Schema(
	{
    name:{
		type:String,
		required:true
	},
    degree:{
		type:String,
		required:true
	},
	email:{
		type:String,
		required:true,
		unique:false
		
	},
	mobile:{
		type:String,
		
	},
	address:{
		type:String,
		
	},
	subject:{
		type:String,
		
	},
	chapter:{
		type:String,
		
	},
	topic:{
		type:String,
		
	},
	number_of_ques:{
		type:Number,
		
	},
	channel_name:{
		type:String,
		
	},
	link_of_playlist:{
		type:String,
		
	},
	pdf:{
		type:String,
		required:true
	},
	drive_link:{
		type:String
	}

	});

//model
mongoose.model('contribute',contribute_schema);

module.exports=mongoose.model('contribute');

