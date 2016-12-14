'use strict'

// IntentData comes in the form of a JSON file
const request = require('superagent');

module.exports.process = function process(intentData, cb) {
    if (intentData.intent[0].value != 'convert') {
        return cb(new Error(`Expected convert intent, got ${intentData.intent[0].value}`));
    }

    if (!intentData.input_currency) {
        return cb(new Error('Missing input or output currency in convert intent'));
    }
    const amount = intentData.number[0].value;
    const input_currency = intentData.input_currency[0].value;
    const output_currency = intentData.input_currency[1].value;

    request.get('http://api.fixer.io/latest?base=' + input_currency, (err, response) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500);
        }
        console.log(response.body);
        const rates = response.body.rates;
        var result;
        if (Object.keys(rates).indexOf(output_currency) >= 0) {
            result = Math.round(rates[output_currency]*amount*100)/100;
            return cb(false, `${amount} ${input_currency} is ${result} ${output_currency} :smile:`);
        } else {
            return cb(false, `Sorry, I do not know the exchange rate between ${input_currency} and ${output_currency}. :hushed:`);
        }
        
    });
}