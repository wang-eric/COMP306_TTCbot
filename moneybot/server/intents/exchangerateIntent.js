'use strict'

// IntentData comes in the form of a JSON file
const request = require('superagent');

module.exports.process = function process(intentData, cb) {
    if (intentData.intent[0].value != 'exchange rate') {
        return cb(new Error(`Expected exchange rate intent, got ${intentData.intent[0].value}`));
    }

    if (!intentData.input_currency) {
        return cb(new Error('Missing input or output currency in exchange rate intent'));
    }
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
            console.log(input_currency);
            console.log(output_currency);
            console.log(rates);
            result = rates[output_currency];
            return cb(false, `The exchange rate from ${input_currency} to ${output_currency} is ${result}. :smiley:`);
        } else {
            return cb(false, `Sorry, I do not know the exchange rate from ${input_currency} to ${output_currency}. :hushed:`);;
        }
        
    });
}