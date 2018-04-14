
import * as express from 'express';
import * as http from 'http';
import * as WebSocket from 'ws';
import { text } from 'body-parser';
import { User } from './user';
import { Status } from './user';

var users: User[] = [];
const app = express();
var json: JSON;

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

var clientsMap = new Set< WebSocket >();

wss.on('connection', (ws: WebSocket) => {

    //connection is up, let's add a simple simple event
    ws.on('message', (message: string) => {

        if(message === "web" ) {

            var arrayRooms = Array();

            var event = {
                ipAdress: "192.168.0.1",
                mac: "AA::BB::CC",
                state: "online",
                roomId: "37",
                timestamp : "2018"
              };
        
            arrayRooms.push(event);
            
            event = {
                ipAdress: "192.168.0.1",
                mac: "AA::BB::CC",
                state: "offline",
                roomId: "39",
                timestamp : "2018"
              };
        
            arrayRooms.push(event);
        
            var str = JSON.stringify(arrayRooms);

            ws.send(str);

        } else if( message === "desk" ) {
            clientsMap.add(ws);
        }

    });   

    ws.on('close', (code: number, reason:string) => {
        
    });
});
  
server.listen(process.env.PORT || 10000, () => {
    console.log(`Server started on port ${server.address().port} :)`);
});
