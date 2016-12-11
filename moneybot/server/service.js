'use strict'

const express = require('express');
const service = express();
const ServiceRegistry = require('./serviceRegistry');

const servRegistry = new ServiceRegistry();

// Replace "put" with "get" to test in web address with "localhost:PORT/service/
service.put('/service/:intent/:port', (req, res, next) => {
    const serviceIntent = req.params.intent;
    const servicePort = req.params.port;

    // Checking for IPv6
    const serviceIp = req.connection.remoteAddress.includes('::') ? `[${req.connection.remoteAddress}]` : req.connection.remoteAddress;
    
    servRegistry.add(serviceIntent, serviceIp, servicePort);

    res.json({result:`${serviceIntent} at ${serviceIp}:${servicePort}`});
});

module.exports = service;