// server.js

const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

app.use(express.static("public"));

const users = {};

io.on("connection", function(socket) {
  let username;

  socket.on("username", function(data) {
    username = data;
    users[socket.id] = username;
    socket.broadcast.emit("user connected", { username: username });
  });

  socket.on("chat message", function(data) {
    const message = data.message;
    const sender = users[socket.id];
    io.emit("chat message", { username: sender, message: message });
  });

  socket.on("disconnect", function() {
    const username = users[socket.id];
    delete users[socket.id];
    socket.broadcast.emit("user disconnected", { username: username });
  });
});

http.listen(3000, function() {
  console.log("listening on *:3000");
});
