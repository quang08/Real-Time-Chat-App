const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);

const cors = require('cors');
app.use(cors());

const {Server} = require('socket.io');
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
});

io.on('connection', (socket) => {
    console.log(`User Connected: ${socket.id}`);

    //join a room to chat
    socket.on('join_room', (data) => {
        socket.join(data); //call join() to subscribe/join the socket/room to a given channel
        console.log(`User with ID: ${socket.id} joined room: ${data}`);
    });

    //send message
    socket.on('send_message', (data) => { //recieve the messageData from the client side
        //emit the data the current joined room
        socket.to(data.room).emit('receive_message', data); //emit the message to ppl in the same room
    });

    //leave room
    socket.on('disconnect', () => {
        console.log("User Disconnected", socket.id);
    });
})

server.listen(3001, () => {
    console.log('listening on *:3001');
  });