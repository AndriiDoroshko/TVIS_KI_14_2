
import * as express from 'express';
import * as http from 'http';
import * as WebSocket from 'ws';
import { text } from 'body-parser';
import { PCInfo } from './user';
import { Status } from './user';

var knownPCArray: PCInfo[] = [];

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const timeout = 5000;

var clientsMap = new Set< WebSocket >();

wss.on('connection', (ws: WebSocket) => {

    //connection is up, let's add a simple simple event
    ws.on('message', (message: string) => {

        if(message == "web" ) {
        
            var demoPC = new PCInfo(
                    "127.0.0.1"
                ,   "AA11BB22CC33"
                ,   "SuchACoolPC"
                ,   "33"
            )

            knownPCArray.push(demoPC);
            var str = JSON.stringify(knownPCArray);
            knownPCArray.pop();

            ws.send(str);

        } else if( message.substr(0, 4) == "desk" ) {
            
            var pcInfoInJson = message.substr(4, message.length);
            var newPC = PCInfo.fromJSON(pcInfoInJson);
            
            var now = new Date();
            var pcIsAlreadyKnown = false;   

            knownPCArray.forEach(knownPC => {
                if(
                        knownPC.ip == newPC.ip
                    &&  knownPC.mac == newPC.mac
                    &&  knownPC.name == knownPC.name
                ) {
                    pcIsAlreadyKnown = true;
                }

                var timePassed = now.getTime() - knownPC.timestamp.getTime();              
                if( timePassed > timeout )
                    knownPC.status = Status.offline;
            });

            if(!pcIsAlreadyKnown) {

                knownPCArray.push(newPC);
            }
        }
    });   
});
  
server.listen(process.env.PORT || 10000, () => {
    console.log(`Server started on port ${server.address().port} :)`);
});
