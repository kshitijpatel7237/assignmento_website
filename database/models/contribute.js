var mongoose=require('mongoose');
mongoose.Promise = require('bluebird');
mongoose.Promise = require('q').Promise;
var router=require('router');

// schema

var contribute_schema=mongoose.Schema(
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
	subject:{
		type:String
		
	},
	chapter:{
		type:String
		
	},
	topic:{
		type:String
		
	},
	number_of_ques:{
		type:Number,
	
	},
	channel_name:{
		type:String
		
	},
	link_of_playlist:{
		type:String
		
	},
	
	drive_link:{
		type:String
	},
	mark_down:{
		type:String
	},
	isApproved:{
		type:String,
		default:"NA"
	}
	

	});


mongoose.model('contribute',contribute_schema);

module.exports=mongoose.model('contribute');

