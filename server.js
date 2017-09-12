var sqlite3 = require('sqlite3').verbose()
var path = require('path');
var fs = require("fs");
var express = require('express');
var app = express();
var PORT = process.env.PORT || 8080

//connect to the database
var db = new sqlite3.Database('./coursera.db');

// using webpack-dev-server and middleware in development environment
if(process.env.NODE_ENV !== 'production') {
  var webpackDevMiddleware = require('webpack-dev-middleware');
  var webpackHotMiddleware = require('webpack-hot-middleware');
  var webpack = require('webpack');
  var config = require('./webpack.config');
  var compiler = webpack(config);
  
  app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: config.output.publicPath }));
  app.use(webpackHotMiddleware(compiler));
}

//path for static files - to be served to the client
app.use(express.static(path.join(__dirname, 'dist')));


//Application Routes
app.get('/', function(request, response) {
  response.sendFile(__dirname + '/dist/index.html')
});

//api to get thread info in json
app.get('/api/:id', function(request, response) {
  var filePath = path.join(__dirname, 'dist', 'threads', request.params.id + '.txt');

  //reading file to get threadId's 
  fs.readFile(filePath, function (err, data) {
    if (err) {
       return console.error(err);
    }
    var scores = [];
    threadIdList = [];
    threadList = data.toString().split('\n');
    threadList.forEach((x) => {
      var pair = x.split(' ');
      scores.push(pair[1]);
      threadIdList.push(pair[0]);
    })

    //getting thread info from database
    //getting the thread information from the database for that thread and
    //also getting the first most-recent post of that thread from that database.
    query = 'SELECT id, threadId, answerBadge, lastAnsweredAt, createdAt, title, viewCount, totalAnswerCount, content FROM thread WHERE threadId IN (\'' + threadIdList.join('\', \'') + '\');';
    db.all(query, function(err,rows){
      //console.log(rows.length);
      if(err){
        console.log('ERROR while querying database ; ' + err);
        return;
      };
      var rows_length = rows.length;
      var count = 0;
      rows.forEach((ele) => {
        
        ele.score = scores[threadIdList.indexOf(ele.threadId)];
        //query for most-recent post of the thread
        db.get('SELECT content from post WHERE forumQuestionId=\'' + ele.id + '\' ORDER BY createdAt DESC;', function(err, row){
          count++;
          if(err){
            console.log('ERROR while querying database ; ' + err);
            return;
          };
          
          if(row){
            ele.post = row.content; 
          }else{
            ele.post = ele.content;
          }
          if(count == rows_length)
             response.json(rows); 
        })
        
      })
      
    });

  });

});



//global routes - route to the react app
app.get('*', function(request, response) {
  response.sendFile(__dirname + '/dist/index.html')
});

//Port for listening
app.listen(PORT, function(error) {
  if (error) {
    console.error(error);
  } else {
    console.info("==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.", PORT, PORT);
  }
});
