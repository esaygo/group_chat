//the server param is passed from server.js var route = require("./routes/index.js")(app, server);
//so that the code for server's response can be included in here
module.exports = function(app, server){
  //this gets the socket.io module
var io = require("socket.io").listen(server);
var existing_users = [];
var messages = [];
var session = require('express-session');

app.use(session({resave: true, saveUninitialized: true, secret: "ariel"}));

  app.get('/', function (req,res) {
    //session_id = req.sessionID;
    res.render('index');
  });

  // Whenever a connection event happens (the connection event is built in) run the following code
io.sockets.on('connection', function(socket) {

      socket.join('group_chat');

      socket.on("got_new_user", function(data){
        socket_id = socket.id.replace(/[/#]/g,"");
        socket.username = data.name;
        console.log(socket.username);
        //console.log("server id: " + socket_id);
        if(existing_users.length > 0) {
          socket.emit("existing_users", {"other_messages": messages});
        }
        //broadcast to all users
        io.to('group_chat').emit('new_user', {
                                new_name: data.name,
                                id: socket_id
                              });
        //existing_users.id = session_id;
        existing_users.push({
          id: socket_id,
          name: socket.username
        });
      });//end of "got_new_user"



      socket.on('new_message', function(data) {
          //console.log(data.sid,data.message);
          for(var i = 0; i < existing_users.length; i++) {
            if(existing_users[i].id === data.sid){
              //existing_users[i].message = data.message;
              var user_name = existing_users[i].name;
            }
          }
          console.log(data.message);
          console.log(user_name);
          io.to('group_chat').emit('latest_message', {
                                    latest_message: data.message,
                                    name: user_name
                                  });
          messages.push({
            user: user_name,
            message: data.message
          });
          console.log(existing_users);
          console.log(messages);
      });

  socket.on('disconnect', function(){
    console.log(existing_users);
    console.log(socket.id, "got disconnected");


    var removeByAttr = function(arr, attr, value){
      var i = arr.length;
      while(i--){
        console.log('i=', i, ' val= ', arr[i][attr]);
         if( arr[i]
             && (arr[i][attr] === value ) ){
               console.log("i is: ", i);
             arr.splice(i,1);
         }
      }

    return arr;
  }
    socket_id = socket.id.replace(/[/#]/g,"");
    removeByAttr(existing_users, 'id', socket_id);

    socket.leave('group_chat');
    console.log("after disc, users are: ", existing_users);
    io.to('group_chat').emit('user_disconected', {user: socket.username})

  });

  }); //end of connection

} //end of module.exports
