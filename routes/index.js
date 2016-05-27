//the server param is passed from server.js var route = require("./routes/index.js")(app, server);
//so that the code for server's response can be included in here
module.exports = function(app, server){
  //this gets the socket.io module
var io = require("socket.io").listen(server);
var existing_users = [];
var session = require('express-session');

app.use(session({resave: true, saveUninitialized: true, secret: "ariel"}));

  app.get('/', function (req,res) {
    //session_id = req.sessionID;
    res.render('index');
  });

  // Whenever a connection event happens (the connection event is built in) run the following code
  io.sockets.on('connection', function(socket) {

    socket.join('group_chat');
    socket.on('disconnect', function(){socket.leave('group_chat') });

    socket.on("got_new_user", function(data){
      socket_id = socket.id.replace(/[/#]/g,"");
      console.log("server id: " + socket_id);
      //broadcast to all users
      io.to('group_chat').emit('new_user', {
                              new_name: data.name,
                              id: socket_id
                            });
      //existing_users.id = session_id;
      existing_users.push({
        name: data.name,
        id: socket_id
      });

      socket.on('new_message', function(data) {
          console.log(data.sid,data.message);
          for(var i = 0; i < existing_users.length; i++) {
            if(existing_users[i].id === data.sid){
              existing_users[i].message = data.message;
              socket.emit("existing_users", {"other_users": existing_users});
            }
          }
          console.log(existing_users);
      });





    });


  }); //end of connection

} //end of module.exports
