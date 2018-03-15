'use strict';

const express = require('express');
const app = express();
const jwt = require('express-jwt');
const jwks = require('jwks-rsa');
const cors = require('cors');
const bodyParser = require('body-parser');
const devices = require('./devices');
const users = require('./users');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const authCheck = jwt({
  secret: jwks.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: "https://intellinode.eu.auth0.com/.well-known/jwks.json"
    }),
    // This is the identifier we set when we created the API
    audience: 'http://vuelogintest.com',
    issuer: "https://intellinode.eu.auth0.com/",
    algorithms: ['RS256']
});

app.get('/api/lights', authCheck, (req, res) => {
  console.log(req.query);
  devices.getDevicesForUser(req.query.user)
  .then((result) => {
    res.json(result);
  })
  .catch((err) => {
    res.status(500).send(err);
  });
});

app.post('/api/register/device', authCheck, (req, res) => {
  devices.getStagedDevice(req.body)
  .then((result) => {
    res.send(result);
  })
  .catch((err) => {
    res.status(500).send(err);
  });
  
});

app.post('/api/register/user', authCheck, (req, res) => {
  users.registerUser(req.body)
  .then((registered) => {
    res.send({success: registered});
  })
  .catch((err) => {
    res.status(500).send(err);
  });
  
});

app.listen(3333);
console.log('Listening on localhost:3333');
