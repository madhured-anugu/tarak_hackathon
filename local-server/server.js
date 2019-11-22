'use strict';

const path = require('path');

const express = require('express');
const proxy = require('express-http-proxy');
const url = require('url');
const _ = require('lodash');
const portfinder = require('portfinder');
const cors = require('cors');
const http = require("http");
const socketio = require("socket.io");
const accountRouter = require('./routes/account');
const connection = require('./socket');
const console = require('./lib/consoleColors');
const bodyParser = require('body-parser');
const compression = require('compression');
const morgan = require('morgan');
let app, 
   server;

//app.use(express.static(staticFileServerPath));
let port = process.env.PORT || 8500;

portfinder.basePort = port;

const onPortCB = (err, portNo) => {
  if (err) {
    console.redBold('Port Not Avaialable because of ' + err);
    return;
  }
  port = portNo;
  setupApp(port);
};

portfinder.getPort(onPortCB);
function onNewWebsocketConnection(socket){
  console.info(`Socket ${socket.id} has connected.`);
  connection.onlineClients.add(socket.id);

  socket.on("disconnect", () => {
     connection.onlineClients.delete(socket.id);
      console.info(`Socket ${socket.id} has disconnected.`);
  });


}
function setupApp(port) {
  app = express();
  server = http.createServer(app);
  const io = socketio(server);
  connection.socket = io;
  io.on("connection", onNewWebsocketConnection);
  server.listen(port,'0.0.0.0');
  // server = app.listen(port, function() {
  //   console.cyanBold('Log Parser Listening on ' + port);
    
  // });
  onServerBind();

  server.on('error', function(err) {
    console.redBold(' Error while trying to setup LogParser  ');
    var code = err && err.code ? err.code : err;
    console.log(code);
  });
}

function onServerBind() {
  app.use(cors());
  app.use(compression());

  // parse application/json
  app.use(bodyParser.json());

  // parse application/x-www-form-urlencoded
  app.use(bodyParser.urlencoded({ extended: true }));

  app.use('/api/account/', accountRouter);

  app.use(morgan('dev'));

  
}
