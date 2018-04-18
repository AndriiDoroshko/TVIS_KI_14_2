import * as express from 'express';
import * as http from 'http';
import * as WebSocket from 'ws';
import { text, Options } from 'body-parser';
import { User } from './user';

var fs = require('fs');
var path = require('path');

let user = new User("1234", "1", "online", "33")
var users: User[] = [];
exports.users = users
//users.push(user)
const app = express();
app.use(express.static(__dirname + '/webUI'));
var json: JSON;
//initialize a simple http server
var server = http.createServer(app)

//initialize the WebSocket server instance
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws: WebSocket) => {

    //connection is up, let's add a simple simple event
    ws.on('message', (message: string) => {
        
        var ip: string = ""
        var mac: string = ""
        var name: string = ""
        var class_number: string = ""

        var keyCount = 0
        let JsonObject: string = message;

        JSON.parse(JsonObject, (key, value) => {
            keyCount++;
            console.log(key);
            switch (key) {
                case 'ip': 
                    ip = value;
                    break;
                case 'mac':
                    mac = value;
                    break;
                case 'name':
                    name = value;
                    break;
                case 'class_number':
                    class_number = value;
                    break;
                case 'get': 
                    ws.send(JSON.stringify(users));
                    break;
                default: 
                    console.log(key);
                    break;
            }
          });
          
          if (ip != "" && mac != "" && name != "" && keyCount == 5) {  // keyCount == 4 but it's 3
            let newUser = new User(ip, mac, name, class_number);

            var isUserAlreadyExist = false;

            users.forEach(user => {
                console.log('----------');
                if (user.mac == newUser.mac) {
                    user.ip = newUser.ip;
                    user.name = user.name;
                    user.class_number = newUser.class_number;
                    isUserAlreadyExist = true;
               }
            });
    
            if (!isUserAlreadyExist) {
                users.push(newUser);
            }
          }
    //console.log(users);

    users.forEach(user => {
        user.setStatus();
    })
    fs.writeFile("dist/server/webUI/Computer.txt", JSON.stringify(users), function(err: string) {
        if (err) {
            console.log(err);
        }
    })
     }
    );   

    ws.send('Hi there, I am a WebSocket server!!!');
});

wss.on('close', (code, reason) => {
    //wss.send('webSocket connetction closed /(code)');
});

//start our server
server.listen(process.env.PORT || 8999, () => {
    console.log(`Server started on port ${server.address().port} :)`);
});

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/webUI/index.html'));
  })

app.get('/getusers', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.sendFile(JSON.stringify(users));
  })

app.use(express.static(__dirname + "/webUI/Computer.txt"));
