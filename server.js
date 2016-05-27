

var express = require('express');
var path = require('path'); //!!!
var bodyParser = require('body-parser');

var app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, "./static"))); //!!!
// This sets the location where express will look for the ejs views
app.set('views',path.join(__dirname, '/views'));
// Now lets set the view engine itself so that express knows that we are using ejs as opposed to another templating engine like jade
app.set('view engine', 'ejs');
//app.use(bodyParser.json());

var server = app.listen(8000, function() {
  console.log("listening on port 8000");
});

var route = require("./routes/index.js")(app, server);
