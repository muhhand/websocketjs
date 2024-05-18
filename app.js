const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

app.get('/', (req, res) => {
    res.send('Socket.IO server is running');
});

io.on('connection', (socket) => {
    console.log('Client connected');

    socket.on('message', (data) => {
        try {
            handleMessage(data);
        } catch (e) {
            console.error('Error:', e);
        }
    });

    socket.on('send to server', (data) => {
        try {
            receiveFrameAndSendToFlutter(data);
        } catch (e) {
            console.error('Error:', e);
        }
    });

    socket.on('notification', (data) => {
        try {
            handleNotification(data);
        } catch (e) {
            console.error('Error:', e);
        }
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

function handleMessage(data) {
    try {
        io.emit('message', data);
        console.log('Server received message:', data);
    } catch (e) {
        console.error('Error:', e);
    }
}

function receiveFrameAndSendToFlutter(data) {
    try {
        io.emit('receive from server', data);
    } catch (e) {
        console.error('Error:', e);
    }
}

function handleNotification(data) {
    try {
        io.emit('notification', data);
        console.log('Server received notification:', data);
    } catch (e) {
        console.error('Error:', e);
    }
}


const PORT = 3000;

server.listen(PORT, () => {
    console.log(`Server is listening on ${PORT}`);
});
