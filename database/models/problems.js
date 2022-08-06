var mongoose=require('mongoose');
mongoose.Promise = require('bluebird');
mongoose.Promise = require('q').Promise;
var router=require('router');

// schema

var problem_schema=mongoose.Schema(
	{
		problem_id:{
		type:Number
		
	},
	contest_id:{
		type:Number
		
	},
    problem_name:{
		type:String
		
	},
    problem_text:{
		type:String
		
	},
	problem_setter_name:{
		type:String
		
	},
	total_submissions:{
		type:Number
		
	},
	correct_submissions:{
		type:Number
		
	},
	topic_tag:{
		type:String
		
	}

	});

//model pdf:{
		//type:String,
		//required:true
	//},
mongoose.model('problems',problem_schema);

module.exports=mongoose.model('problems');

