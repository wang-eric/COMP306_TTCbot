'use strict'

const slackClient = require("../server/slackClient");

//wit bot - moneybot
//HWP3HVWLBEPIQXVMY3ORK7W7F6YWUARO
const witToken = 'HWP3HVWLBEPIQXVMY3ORK7W7F6YWUARO'
const witClient = require('../server/witClient')(witToken);
//slack bot - moneybot
const slackToken = 'xoxb-114764610197-gWjiZiGNoWK6zMVJsNVlprbl';
const slackLogLevel = 'verbose';

const rtm = slackClient.init(slackToken, slackLogLevel, witClient);
rtm.start();