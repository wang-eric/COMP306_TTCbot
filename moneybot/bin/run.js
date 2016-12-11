'use strict'

const slackClient = require("../server/slackClient");
const service = require("../server/service");
const http = require("http");
const server = http.createServer(service);
//wit bot - FRANK
//DIULG2EX2WND7WZDWZTMJNMTVN52DZJO
//wit bot - ttc
//W2EEL6THJCLWZFGL4FGOPDWQ77QWF6WJ
const witToken = 'HWP3HVWLBEPIQXVMY3ORK7W7F6YWUARO'
const witClient = require('../server/witClient')(witToken);
//slack bot - FRANK
//xoxb-106871034272-rPIrkg3UdVOV3sU5USmrax9H
//slack bot - ttc
//xoxb-110070002308-GFBJocpKsSPDHvOTqcU6A55h
//xoxb-110382865168-TJvlLcIMqhrMxXY9PA3GEehZ
const slackToken = '';
const slackLogLevel = 'verbose';

const rtm = slackClient.init(slackToken, slackLogLevel, witClient);
rtm.start();

slackClient.addAuthenticatedHandler(rtm, () => server.listen(4000));

server.on('listening', function() {
    console.log(`FRANK is listening on ${server.address().port} in ${service.get('env')} mode. `);
});