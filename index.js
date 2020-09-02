const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql');
const schema = require('./Schema/Schema');
const cors = require('cors');
const { URI } = require('./keys/keys');
var socket = require('socket.io');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

// used for making room id
const compareFunc = (a, b) => {
    return ('' + a).localeCompare(b,'en', { numeric: true });
}

const app = express();


app.use(cors());
app.use( bodyParser.json() );

// having options to connect to the db
options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify:false
}

// connecting to the db
mongoose.connect(URI, options);

// adding event listeners
mongoose.connection.once('connected', ()=>{
    console.log("Connected to the Database!");
}).on('error', ()=>{
    console.log("Error connecting to the Database!");
});

// graphql route
app.use('/graphql',graphqlHTTP({
    schema,
    graphiql: true
}));

// listening on port
PORT = process.env.PORT || 1000;
const server = app.listen(PORT, ()=>{
    console.log("Listening to requests on port", PORT);
})

var io = socket(server);

// server db for keeping a record of users and sockets
const users = {};
const priv = {};
const groups = {};

io.on('connection',(socket)=>{

    // when user disconnects
    socket.on('disconnect', (test)=>{
        io.emit('delStat', { id: socket.nick });
        console.log("Socket:",socket.nick);
        const temp = removeUser(socket.nick);
        console.log("Temp:",temp);
        if(temp){
            console.log("User has disconnected!");
        }else{
            console.log("User wasn't present!")
        }

    });

    // typing feature here
    socket.on('typing', (data, callback) => {
        io.emit('updateStat', { id: data.from });
        let tempto = [data.from, data.to].sort(compareFunc);
        let roomId = jwt.sign(tempto[0], tempto[1]);
        if(roomExist(roomId)){
            let result = {
                msgFormat: `${data.name} is typing`,
                source: data.from,
            }
            socket.to(roomId).emit('type', result);
            callback(true);
        }else{
            callback(false);
        }
    });

    // stop typing feature here
    socket.on('stop-typing', (data, callback) => {
        io.emit('updateStat', { id: data.from });
        let tempto = [data.from, data.to].sort(compareFunc);
        let roomId = jwt.sign(tempto[0], tempto[1]);
        if(roomExist(roomId)){
            socket.to(roomId).emit('stop-type');
            callback(true);
        }else{
            callback(false);
        }
    });

    // added private chat logic here
    socket.on('sendPriv', (data, callback)=>{
        io.emit('updateStat', { id: data.from });
        let tempto = [data.from, data.to].sort(compareFunc);
        let roomId = jwt.sign(tempto[0], tempto[1]);
        if(roomExist(roomId,data.from, data.to)){
            let msgFormat = {
                "sender": {
                    "name": data.name,
                    "_id":data.from,
                    "__typename": "User"
                },
                "time": data.time,
                "text": data.message,
                "bonus": [tempto[0], tempto[1]]
            }
            io.in(roomId).emit('comm', msgFormat);
            console.log("Room exiists")
            callback(true);
        }else{
            callback(false);
        }
    });


    // join priv chat room for personal DM
    // needs refactoring
    // TIP: Connect with all contacts rather connecting to specific people
    socket.on('privChat', (data)=>{
        io.emit('updateStat', { id: data.from });
        let tempto = [data.from, data.to].sort(compareFunc);
        let roomId = jwt.sign(tempto[0], tempto[1]);
        if(users[tempto[0]] && users[tempto[1]]){
            priv[roomId] = [tempto[0], tempto[1]];
            console.log("Room made!",priv);
            users[tempto[0]].join(roomId);
            users[tempto[1]].join(roomId);
            console.log("\nAll users are in!");
            console.log(roomId);
            console.log("PrivRoom",priv[roomId]);
        }else{
            console.log("Try One of the user isn't online!");
        }
    })

    // custom ting for adding a new user / updating his socket
    socket.on('newUser', ({ id }, callback)=>{
        addUser({ id });
        console.log("No:", (Object.keys(users)).length);
        io.emit('updateStat', { id });
        callback(true);
    });

    // think this is useless
    socket.on('sendMessage', (message, to, callback)=>{
        console.log("Message:",message,"to:",to);
        callback();
    })

    // helper functions
    const addUser = ({ id }) => {
        id = id.trim();
        socket.nick = id;
        users[socket.nick] = socket;
    };

    const roomExist = (room, from=null, to=null) => {
        if(room in priv){
            return true;
        }else if(from && to){
            let tempto = [from, to].sort(compareFunc);
            let roomId = jwt.sign(tempto[0], tempto[1]);
            console.log(users[tempto[0]])
            console.log(users[tempto[1]])
            if(users[tempto[0]] && users[tempto[1]]){
                priv[roomId] = [tempto[0], tempto[1]];
                console.log("Room made!",priv);
                users[tempto[0]].join(roomId);
                users[tempto[1]].join(roomId);
                console.log("\nAll users are in!");
                console.log(roomId);
                console.log("PrivRoom",priv[roomId]);
                return true
            }else{
                console.log("One of the user isn't online!");
                return false;
            }
        }
        return false;
    }
    
    const removeUser = (id) => {
        if(id in users){
            for (var key of Object.keys(priv)){
                let temp = priv[key].includes(id)
                if(temp){
                    console.log("Room",temp)
                    delete priv[key]
                }
            }
            delete users[id];
            return true;
        }else{
            return false;
        }
    }
    
})