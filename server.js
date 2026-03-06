const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

let players = {};

io.on("connection",(socket)=>{

socket.on("joinRoom",({nickname,room})=>{
socket.join(room);

players[socket.id] = {nickname,room};

socket.to(room).emit("playerMoved",{id:socket.id,left:"45%",top:"40%"});
});

socket.on("move",(data)=>{
let p = players[socket.id];
if(!p) return;
socket.to(p.room).emit("playerMoved",data);
});

socket.on("chat",(data)=>{
let p = players[socket.id];
if(!p) return;
io.to(p.room).emit("playerChat",data);
});

socket.on("changeImage",(data)=>{
let p = players[socket.id];
if(!p) return;
io.to(p.room).emit("playerImageChanged",data);
});

socket.on("disconnect",()=>{
let p = players[socket.id];
if(!p) return;
io.to(p.room).emit("playerLeft",socket.id);
delete players[socket.id];
});

});

server.listen(3000,()=>{
console.log("BonziWORLD server running on http://localhost:3000");
});