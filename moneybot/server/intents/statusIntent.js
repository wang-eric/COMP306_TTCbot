'use strict'

// IntentData comes in the form of a JSON file
const request = require('superagent');

module.exports.process = function process(intentData, cb) {
    if (intentData.intent[0].value != 'status') {
        return cb(new Error(`Expected status intent, got ${intentData.intent[0].value}`));
    }

    request.get('https://updown.io/api/checks/1vy9?api-key=ro-h3l9yapk8j72rh3ckjh5', (err, response) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500);
        }
        console.log(response.body);
        const urlString = response.body.url;
        const last_check = response.body.last_check_at;
        if (response.body.down = true) {
            return cb(false, `${urlString} is down since ${last_check} :dizzy_face:`);
        } else {
            return cb(false, `${urlString} is up since ${last_check} :smile:`);
        }
        
        
    });
}