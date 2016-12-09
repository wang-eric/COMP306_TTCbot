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
    request.get('https://myttc.ca/' + location + '_station.json', (err, res) => {
            if(err || res.statusCode != 200) {
                console.log(err);
                console.log(res.statusCode);
                console.log(res.body);

                return cb(false, `I had a problem finding out the time in ${location}`);
            }
            console.log(location);
            const result = res.body;
            const nextString = getTrainTimes(result);
            //const nextString = result.stops[1].routes[result.stops[1].routes.length-3].stop_times[0].departure_time;
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

function getTrainTimes(obj){
//var obj = JSON.parse(text);
var stops = obj.stops;
var times = "";
var myHash = {};
for (var i = 0; i< stops.length; i++){
	if (stops[i].name.indexOf("Platform")>=0){
		for (var j = 0; j< stops[i].routes.length; j++){
			for (var k = 0; k < stops[i].routes[j].stop_times.length; k++){
				stop_times = stops[i].routes[j].stop_times[k];
				if (!(stop_times.shape in myHash)){
					myHash[stop_times.shape] = stop_times.departure_time;
				} else {
					myHash[stop_times.shape] += stop_times.departure_time;
				}				
			}
		}
	}
}

var result = "";
Object.keys(myHash).forEach(function (key){
	var value = myHash[key];
	result += key + "\n" + value + "\n";
});
return result;
}