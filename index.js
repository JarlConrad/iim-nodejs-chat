const express = require('express');

const app = express();
const server = app.listen(3000, () => {
    console.log('server up')
});

let users = [];

let io = require('socket.io').listen(server);

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
    console.log('a user connected');
    console.log(users)

    users.push({'id': socket.id, 'subname': 'guest'});
    io.emit('new users', users);

    socket.on('chat message', function(msg){
        io.emit('chat message', msg);
    });

    socket.on('is writing', (data) => {
        socket.broadcast.emit('is writing', data);
    });

    socket.on('new subname', (subname) => {
        users.forEach( (user) => {
            if (user.id === socket.id)
            {
                user.subname = subname;
            }
        });
        io.emit('new users', users);
    });

    socket.on('disconnect', function() {
        console.log("user disconnected");
        var index = 0;
        users.forEach( (user) => {
            if (user.id === socket.id)
            {
                users.splice(index, 1);
            }
            index++;
        });
        io.emit('new users', users);
    });
});