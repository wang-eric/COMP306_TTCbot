'use strict'

// IntentData comes in the form of a JSON file
const request = require('superagent');

module.exports.process = function process(intentData, cb) {
    if(intentData.intent[0].value != 'time') {
        return cb(new Error(`Expected time intent, got ${intentData.intent[0].value}`));
    }

    if(!intentData.location) {
        return cb(new Error('Missing location in time intent'));
    } 

    const location = intentData.location[0].value;
    request.get('https://myttc.ca/' + location + '_station.json', (err, response) => {
            if(err || res.statusCode != 200 || !res.body.result) {
                console.log(err);
                console.log(res.body);

                return cb(false, `I had a problem finding out the time in ${location}`);
            }
            console.log(location);
            const result = response.body;
            const nextString = result.stops[1].routes[result.stops[1].routes.length-3].stop_times[0].departure_time;
            const timeString = moment.unix(timestamp + result.dstOffset + result.rawOffset).utc().format('dddd, MMMM Do YYYY, h:mm:ss a');

            res.json({result: nextString});
            return cb(false, `In ${location}, it is now ${nextString}`);
    });
    // const location = intentData.location[0].value.replace(/,.?iris/i, '');
    /*
    request.get(`http://localhost:4010/service/${location}`, (err, res) => {
        if(err || res.statusCode != 200 || !res.body.result) {
            console.log(err);
            console.log(res.body);

            return cb(false, `I had a problem finding out the time in ${location}`);
        }

        return cb(false, `In ${location}, it is now ${res.body.result}`);
    });*/
}