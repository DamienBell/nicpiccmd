var express = require('express');
var app = express();
var Parse = require('node-parse-api').Parse;

var parse = new Parse(process.env.APP_ID,process.env.M_KEY );


parse.find('pic', 'FyUHEzkJ1g', function (err, response) {
  console.log(response);
});

console.log('success')
