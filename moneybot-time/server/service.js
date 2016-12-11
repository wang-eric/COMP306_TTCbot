'use strict'

const express = require('express');
const service = express();
const request = require('superagent');
const moment = require('moment');

// geokey: AIzaSyDweFYmMiZWrMjAE16fq5suQUMrV7JEwG4
// https://maps.googleapis.com/maps/api/geocode/json?address=berlin&key=AIzaSyDweFYmMiZWrMjAE16fq5suQUMrV7JEwG4
// https://maps.googleapis.com/maps/api/geocode/json?address=berlin&key=AIzaSyAdKXEyHk9wZr0jHzmiAjiGLs9cqp1H5Y8
// ttc: AIzaSyBvWAxpyWXhn43cIWyu251Jsw3FbI0cNWc
// Time zone key: AIzaSyAC8UfkEFgOG-MHAZ4yA3L18nakUqP9zhs
//https://maps.googleapis.com/maps/api/timezone/json?location=38.908133,-77.047119&timestamp=1458000000&key=AIzaSyAC8UfkEFgOG-MHAZ4yA3L18nakUqP9zhs


// Colon defines a request parameter
service.get('/service/:currency', (req, res, next) => {

        const amount = req.params.amount;
        const input_currency = req.params.input_currency;
        const output_currency = req.params.output_currency;
        //const timestamp = +moment().format('X');

        request.get('http://api.fixer.io/latest?base=' + input_currency, (err, response) => {
            if (err) {
                console.log(err);
                return res.sendStatus(500);
            }
            console.log(input_currency);
            const rates = response.body.rates;
            var result;
            if (Object.keys(rates).indexOf(output_currency)>=0)  {
            result = rates[output_currency];
            } else {
            result = "Not found";
            }
            const nextString = result.stops[1].routes[result.stops[1].routes.length-3].stop_times[0].departure_time;
            //const timeString = moment.unix(timestamp + result.dstOffset + result.rawOffset).utc().format('dddd, MMMM Do YYYY, h:mm:ss a');

            res.json({result: nextString});
        });
    /*
    request.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + req.params.location + '&key=AIzaSyAdKXEyHk9wZr0jHzmiAjiGLs9cqp1H5Y8', (err, response) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500);
        }

        const location = response.body.results[0].geometry.location;
        const timestamp = +moment().format('X');

        request.get('https://maps.googleapis.com/maps/api/timezone/json?location=' + location.lat + ',' + location.lng + '&timestamp=' + timestamp + '&key=AIzaSyAC8UfkEFgOG-MHAZ4yA3L18nakUqP9zhs', (err, response) => {
            if (err) {
                console.log(err);
                return res.sendStatus(500);
            }

            const result = response.body;
            const timeString = moment.unix(timestamp + result.dstOffset + result.rawOffset).utc().format('dddd, MMMM Do YYYY, h:mm:ss a');

            res.json({result: timeString});
        });
    });
    */
});

module.exports = service;