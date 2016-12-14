'use strict'

const RtmClient = require('@slack/client').RtmClient;
const CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS;
const RTM_EVENTS = require('@slack/client').RTM_EVENTS;
let rtm = null;
let nlp = null;

function handleOnAuthenticated(rtmStartData) {
    console.log(`Logged in as ${rtmStartData.self.name} of team ${rtmStartData.team.name}, but not yet connected to a channel`);
}

function handleOnMessage(message) {

    if (message.text.toLowerCase().includes('moneybot')) {

        nlp.ask(message.text, (err, res) => {
            if (err) {
                console.log(err);
                return;
            }

            try {
                if (!res.intent || !res.intent[0] || !res.intent[0].value) {
                    throw new Error("Could not extract intent");
                }

                const intent = require('./intents/' + res.intent[0].value.replace(/\s+/g, '') + 'Intent');
            
                intent.process(res, function (error, response) {
                    if (error) {
                        console.log(error.message);
                        return;
                    }

                    return rtm.sendMessage(response, message.channel);
                })
            }
            catch (err) {
                console.log(err);
                console.log(res);
                rtm.sendMessage("Sorry, it doesn't look like anything to me.:simple_smile:", message.channel);
            }
        });
    }
}

function addAuthenticatedHandler(rtm, handler) {
    rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, handler);
}

module.exports.init = function slackClient(token, logLevel, nlpClient) {
    rtm = new RtmClient(token, { logLevel: logLevel });
    nlp = nlpClient;
    addAuthenticatedHandler(rtm, handleOnAuthenticated);
    rtm.on(RTM_EVENTS.MESSAGE, handleOnMessage);
    return rtm;
}

module.exports.addAuthenticatedHandler = addAuthenticatedHandler;