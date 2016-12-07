/* jshint browser: true, jquery: true, camelcase: true, indent: 2, undef: true, quotmark: single, maxlen: 80, trailing: true, curly: true, eqeqeq: true, forin: true, immed: true, latedef: true, newcap: true, nonew: true, unused: true, strict: true */

//include requirement
var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
//var redis = require('redis');
var io = require('./socketIO.js');
var request = require('request');


//connect to mongo database
mongoose.connect('mongodb://localhost/Game');
mongoose.set('debug', true);

//---Modification note-----//
// add new catagory here with both var and db
//  **do not forget to add 'case' in setCatagory()
/*
var citySchema = new mongoose.Schema({
	Name: String,
	Picture: String,
  IdUse: Number
});
var foodSchema = new mongoose.Schema({
	Name: String,
	Picture: String,
  IdUse: Number
});
var cityDb = mongoose.model('cityDB', citySchema);
var foodDb = mongoose.model('foodDB', foodSchema);

*/

//schema for question in db
var allSchema = new mongoose.Schema({
	Question: String,
	Name: String,
	Picture: String,
	IdUse: Number
});
var allDb = mongoose.model('allDB', allSchema);

//schema for user's score
var topScoreSchema = new mongoose.Schema({
    UserName: String,
    UserScore: Number
});
var scoreDb = mongoose.model('TopScore', topScoreSchema);

var app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use('/', express.static('public'));
console.log('!---- Game server side, listening at port 3000 ----!');

//use to set the catagory for every and specify the type
/*
var setCatagory = function(catIn){
  'use strict';
  console.log(catIn);
  var catUp = catIn.toUpperCase();
  //**All 'case' must be UpperCase**
  switch (catUp) {
    case "CITY":
      return cityDb;
      break;
    case "FOOD":
      return foodDb;
      break;
    default:
      return false;
  }
}
*/
//---------------added in the picture and answer to the database
//IN: {questionIn: '', nameItem: '', picUrl: ''}

app.post('/addInfo', function(req,res){
  'use strict';
  console.log('-------------addItem-----------');
  console.log(req.body.questionIn + " --- " + req.body.nameItem + " --- " + req.body.picUrl);
  //classify the catagory
  var activeDB = allDb;

  var newId;
  //check for duplicate
  activeDB.findOne({Name: req.body.nameItem}).exec(function(err,value){
    if(!value){
          //find highest IdUse
          activeDB.find({IdUse:{$exists:true}},
                  {IdUse:1}).sort({IdUse:-1}).limit(1).exec(
            function(err, dataIn){
              console.log('test --- ' + dataIn[0]);
              if(dataIn.length !== 0){
                newId = dataIn[0].IdUse + 1;
              }
              else {
                newId = 1;
              }
            var newItem = new activeDB({
										Question: req.body.questionIn,
                    Name: req.body.nameItem,
                    Picture: req.body.picUrl,
                    IdUse: newId
                  });
            //save item
            newItem.save(function(err){
            if(err){
              console.log('Error Save to DB' + err);
              res.json('Error Saving to DB');
            }
            else{
              console.log('Item Added');
              res.json('Item Added at: ' + newItem);
            }
          });//save function
        });//findOne
      }
    else {
        console.log('already exist');
        res.json('already in the list');
    }


  });

});

//---------return 10 array of highest score-----------------
// OUT: {scoreSort: [{UserName:’someone’, UserScore:1000}]}
app.get('/score', function(req,res){
  'use strict';
  console.log('score');

  //find ten higest record
  scoreDb.find({UserScore:{$exists:true}},
      {UserScore:1, UserName:1}).sort({UserScore:-1}).limit(10).
      exec(function(err, UserListIn){
    //console.log(UserListIn);
    if(err){
      console.log('Cannot retrive' + err);
      res.json('Cannot retrive score');
    }
    else{
      console.log(UserListIn[1] + UserListIn[2]);
      res.json({'scoreSort':UserListIn, 'scoreLenght': UserListIn.length});
    }
  });//end find
  //res.json({'right': 22, 'wrong' : 33});
});//end /score

//------update score all the user score---------------
//IN: {userName:’someone’, score:1000}
app.post('/scoreUpdate', function(req, res){
  'use strict';
  console.log('scoreUpdate');
  var newUser = new scoreDb({
    UserName: req.body.userName,
    UserScore: req.body.score
  });
  newUser.save(function(err){
    if(err){
      console.log('Cannot save user' + err);
      res.json('Cannot save user');
    }
    else{
      console.log('User and Score Added');
      res.json('User and Score Added');
    }
  });//end save

});//end score update


//---Get a random Question and answer----------
// IN : n/a
//OUT {questionOut: '', answer:'', pic:''}
app.get('/question', function(req,res){
  'use strict';
  console.log('question');

  var active = allDb;
  //RNG
  var test;
  active.find({IdUse:{$exists:true}},
          {IdUse:1}).sort({IdUse:-1}).limit(1).exec(
          function(err, dataCount){
			  console.log('test #1 -- ' + dataCount);
		    if(dataCount.length !== 0){
		        test = Math.floor(Math.random() * ((dataCount[0].IdUse+1) - 1) + 1);
				console.log('test #2 -- ' + test);
			        //retrive question
			    active.find({IdUse:test}).exec(
			      function(err, dataIn){
			        if(dataIn.length === 0){
			          console.log('No Question');
			          res.json({'question': 'No Question in DB', 'answerId':0});
			        }
			        else {
			          console.log('return');
					  console.log(dataIn);
			          res.json({'questionOut' : dataIn[0].Question,
													'pic': dataIn[0].Picture,
			                    'answer':dataIn[0].Name});
				   }
			    });//end retrive question
		    }
			else
			{
				console.log("CRASH");
				res.json({'pic': 'http://supperstudio.com/wp-content/uploads/empty-spaces-logo.jpg',
						  'answer':'yes'});
			}
  });//end RNG
  //});// setCatagory
});

app.listen(3000);
