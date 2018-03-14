
import * as express from 'express';
import * as http from 'http';
import * as WebSocket from 'ws';
import { text } from 'body-parser';
import { User } from './user';
import { Status } from './user';

var user = new User(Status.offline, "fde3qr3fe", 2)

var users: User[] = [];
const app = express();
var json: JSON;
//initialize a simple http server
const server = http.createServer(app);

//initialize the WebSocket server instance
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws: WebSocket) => {

    //connection is up, let's add a simple simple event
    ws.on('message', (message: string) => {

        json = JSON.parse(message);
        users.push(User.fromJSON(message));
        for (let i of users) {
            console.log(i)
        };
        //ws.send(`received: %s -> ${json}`);
    });   
    //ws.send('Hi there, I am a WebSocket server');
});


//start our server
server.listen(process.env.PORT || 8999, () => {
    console.log(`Server started on port ${server.address().port} :)`);
});

