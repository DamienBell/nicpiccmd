var express = require('express');
var app = express();
//var Parse = require('node-parse-api').Parse;
//var parse = new Parse(process.env.APP_ID,process.env.M_KEY );

var Kaiseki = require('kaiseki');
var kaiseki = new Kaiseki(process.env.APP_ID,process.env.REST_KEY);
var http = require('http');


function getRandomUser(callback){

  http.get('http://api.randomuser.me/', function(res) {

    var body = '';

    res.on('data', function(chunk) {
        body += chunk;
    });

    res.on('end', function() {

      var user =JSON.parse(body);
      user = user.results[0].user
      user.name = user.name.first;
      callback(user);
    });
}).on('error', function(e) {
      console.log("http error: ", e);
});
}



switch(process.argv[2]){
  case 'testget':
    kaiseki.getObject('pic', 'FyUHEzkJ1g', function (err, res, body, success) {
      console.log(body);
    });
  break;

  case 'localfileupload':
    var localFilePath = __dirname + '/profile.jpg';
    kaiseki.uploadFile(localFilePath, function(err, res, json, success) {

      if(err){
        console.log(err);
        process.exit(0);
      }

      var pic = {
        img: {
          name: json.name,
          __type: 'File'
        }
      }

      kaiseki.createObject('pic', pic, function(err, res, body, success) {

        if (success){
            console.log('created ', body);
        }
      });
    });

  break;
  case 'createuser':
    getRandomUser(function(user){

      kaiseki.createUser(user,
        function(err, res, body, success) {
          if(err){
          console.log('createuser error', err);
        }
        console.log('user created with session token = ', body.sessionToken);
        console.log('object id = ', body.objectId);
      });
    });

  break;

  case 'seeusers':
    kaiseki.getUsers(function(err, res, body, success) {
      console.log('all users = ', body);
    });
  break;
  case 'getcurrent':

  break;

  case 'logincreatepic':

  break;
  case 'filebyuri':

    var buffer = require('fs').readFileSync("http://api.randomuser.me/portraits/women/9.jpg");

    kaiseki.uploadFileBuffer(buffer, 'image/jpeg', 'orange.jpg', function(err, res, body, success) {
      if(err){
        console.log('err', err)
      }
      console.log('uploaded file details', body);
    });
  break;
  default:
    console.log('not known arg', process.argv[2]);
    process.exit(0);
}
