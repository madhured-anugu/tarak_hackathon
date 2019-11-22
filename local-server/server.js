'use strict';

const path = require('path');

const express = require('express');
const proxy = require('express-http-proxy');
const url = require('url');
const _ = require('lodash');
const portfinder = require('portfinder');
const cors = require('cors');

const accountRouter = require('./routes/account');

const console = require('./lib/consoleColors');
const bodyParser = require('body-parser');
const compression = require('compression');
const morgan = require('morgan');
let app, server;

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

function setupApp(port) {
  app = express();
  server = app.listen(port, function() {
    console.cyanBold('Log Parser Listening on ' + port);
    onServerBind();
  });

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
