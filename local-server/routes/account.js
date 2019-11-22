const express = require("express");
const router = express.Router();
const console = require("../lib/consoleColors");
const path = require("path");
const nodeJsondb = require('node-json-db');
const JsonDB = nodeJsondb.JsonDB;
const nodeJsondbOptions = require('node-json-db/dist/lib/JsonDBConfig');
const dbConfig = nodeJsondbOptions.Config;
const _ = require('lodash');
const dbPath = path.join(__dirname, "..", "db", "account");

var db = new JsonDB(new dbConfig(dbPath, true, true, '/'));

router.post("/login", login);
router.post('/createAccount', createAccount);
router.post('/status', setStatus);
router.get('/status', getStatus);
router.post("/getAll", getAll);

function getStatus (req, res, next) {
    const userId = req.param("userId");
    const accounts = db.getData("/") || {};
    const account = accounts[userId];
    if(account){
      res.json(account.status);
    }else{
        res.json('Unknown');
    }

}

function getAll(req, res, next) {
    const data = req.body;
    const userId = data.userId;

    const accounts = db.getData("/") || {};
    const account = accounts[userId];
    if(account){
        const response = [];
        _.each(accounts,(account) => {
            response.push(account);
        })
      res.json(response);
    }else{
        res.json('Unknown');
    }

}

function setStatus (req, res, next) {
    const data = req.body;
    const userId = data.userId;
    const status = data.status;
    const accounts = db.getData("/") || {};
    const account = accounts[userId];
    if(account){
        account.status = status;
        //if online websocket 
        // online (native)

        db.push('/'+userId, account);
        res.json({isSaved: true});
    }else{
        res.json({isSaved: false});
    }
}
function login (req, res, next) {
    const data = req.body;
    const username = data.username;
    const password = data.password;

    if (!username || !password) {
        res.status(403).send({ message: `Invalid username or password` });
        return;
    }
    var accounts = db.getData("/");
    const account = _.find(accounts, (account, userId) => {
        return account.login.username == username && account.login.password === password;
    });

    
    if (account) {
        res.json({
            isAuthorized: true,
            account
        });
    } else {
        res.json({
            isAuthorized: false,
            message: 'Please check your username and password'
        });
    }

}



function createAccount(req, res, next) {
    const data = req.body;

    const firstName = data.firstName;
    const lastName = data.lastName;
    const isAdmin = data.isAdmin;
    const username = data.username;
    const password = data.password;
    
  const userId = Math.floor(Date.now() + (Math.random() * 20000000000));
     
    const acc = {
        firstName,
        lastName,
        isAdmin,
        login: {
            username,
            password,
        },
        userId,
        status: 'Online'
    }

  
    //const 
    try {
        db.push('/' + userId, acc);
       

    } catch (err) {
        console.error(err);
        res.json({isCreated: false, message: 'Issue in creating account'});
        return;
    }
   
    res.json({isCreated: false, message: 'successfully completed'});
}

module.exports = router;