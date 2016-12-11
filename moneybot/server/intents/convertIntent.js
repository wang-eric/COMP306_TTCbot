'use strict'

// IntentData comes in the form of a JSON file
const request = require('superagent');

module.exports.process = function process(intentData, cb) {
    if (intentData.intent[0].value != 'convert') {
        return cb(new Error(`Expected time intent, got ${intentData.intent[0].value}`));
    }

    if (!intentData.input_currency) {
        return cb(new Error('Missing input or output currency in time intent'));
    }
    const amount = intentData.number[0].value;
    const input_currency = intentData.input_currency[0].value;
    const output_currency = intentData.input_currency[1].value;

    request.get('http://api.fixer.io/latest?base=' + input_currency, (err, response) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500);
        }
        console.log(input_currency);
        const rates = response.body.rates;
        var result;
        if (Object.keys(rates).indexOf(output_currency) >= 0) {
            result = Math.round(rates[output_currency]*amount*100)/100;
        } else {
            result = "Not found";
        }
        //const nextString = result.stops[1].routes[result.stops[1].routes.length - 3].stop_times[0].departure_time;
        //const timeString = moment.unix(timestamp + result.dstOffset + result.rawOffset).utc().format('dddd, MMMM Do YYYY, h:mm:ss a');

        return cb(false, `${amount} ${input_currency} is ${result} ${output_currency} `);
    });
    /*
        const location = intentData.location[0].value;
        request.get('https://myttc.ca/' + location + '_station.json', (err, res) => {
                if(err || res.statusCode != 200) {
                    console.log(err);
                    console.log(res.statusCode);
                    console.log(res.body);
    
                    return cb(false, `I had a problem finding out the time in ${location}`);
                }
                console.log(location);
                const result = res.body;
                const nextString = result.stops[1].routes[result.stops[1].routes.length-3].stop_times[0].departure_time;
                //const timeString = moment.unix(timestamp + result.dstOffset + result.rawOffset).utc().format('dddd, MMMM Do YYYY, h:mm:ss a');
    
                //res.json({result: nextString});
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