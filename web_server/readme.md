Node.js supposed to be installed)

to run this files clone server to work directory
run next comands:

`npm init`

`//add the details of your project`

`npm i ws express --save`

`//install the necessary types (and typescript)`

`npm i typescript @types/ws @types/express -D`

`//install typescript-compiler`

`npm install typescript-compiler`


go to src

run next comand:

`//typescript compile`

`tsc`

`//run server`

`node ./dist/server/index.js`


to connect to a webSocket i use "Smart Websocket Client", free tool for Google Chrome browser
https://chrome.google.com/webstore/detail/smart-websocket-client/omalebghpgejjiaoknljcfmglgbpocdp

by address `ws://localhost:8999/`

and sent next JSON:

`{
    
        "status": "online",
        "serialNumber": "14df3f434rewdq",
        "networkId": "2"
  
}`

in your terminal you shoul see object created by JSON