var fs = require('fs');
var https = require('https');
var hue = require("node-hue-api");

var hostname = "insert your philips hue bridge IP address here",
	timeout = null,
	port = 80,
    username = "insert your philips hue bridge api key here",
    api;

api =  hue.HueApi(hostname, username, timeout, port);
state = hue.lightState.create();

var options = {
  host: 'www.dominos.co.uk',
  path: '/Questionnaire/GetPizzaTrackerStatus?orderId=124734300',
  port: 443,
  headers: {'User-Agent': 'Dominos API Client'},
  method: 'GET'
};

var intervalID;

function getCurrentOrderStatus() {
	var orderStatus = JSON.parse(fs.readFileSync('PizzaTrackerStatus.json', 'utf8'));
	parseResponse(orderStatus);
	/*var req = https.request(options, function(res) {
		res.on('data', function(d) {
			parseResponse(JSON.parse(d));
		});
	});
	req.end();
	*/
}

function parseResponse(orderStatus) {
	if(orderStatus.step1Css=="is-step-in-progress") {
		api.setGroupLightState(0, state.xy(0.65,0.3), function(err, result) {  });
		setTimeout(function() {
			api.setGroupLightState(0, state.xy(0.45,0.4), function(err, result) {  });
		}, 2000);
	} else if(orderStatus.step2Css=="is-step-in-progress" && orderStatus.step1Css=="is-step-complete") {
		api.setGroupLightState(0, state.xy(0.58,0.38), function(err, result) {  });
		setTimeout(function() {
			api.setGroupLightState(0, state.xy(0.45,0.4), function(err, result) {  });
		}, 2000);
	} else if(orderStatus.step3Css=="is-step-in-progress" && orderStatus.step2Css=="is-step-complete" && orderStatus.step1Css=="is-step-complete") {
		api.setGroupLightState(0, state.xy(0.53,0.43), function(err, result) {  });
		setTimeout(function() {
			api.setGroupLightState(0, state.xy(0.45,0.4), function(err, result) {  });
		}, 2000);
	} else if(orderStatus.step4Css=="is-step-in-progress" && orderStatus.step3Css=="is-step-complete" && orderStatus.step2Css=="is-step-complete" && orderStatus.step1Css=="is-step-complete") {
		api.setGroupLightState(0, state.xy(0.4,0.5), function(err, result) {  });
		setTimeout(function() {
			api.setGroupLightState(0, state.xy(0.45,0.4), function(err, result) { });
		}, 2000);
	} else if(orderStatus.step5Css=="is-step-in-progress" && orderStatus.step4Css=="is-step-complete" && orderStatus.step3Css=="is-step-complete" && orderStatus.step2Css=="is-step-complete" && orderStatus.step1Css=="is-step-complete") {
		api.setGroupLightState(0, state.xy(0.2,0.12), function(err, result) { });
		setTimeout(function() {
			api.setGroupLightState(0, state.xy(0.45,0.4), function(err, result) {  });
		}, 2000);
		setTimeout(function() {
			clearInterval(intervalID);
		}, 20000);
		
	} else {
		api.setGroupLightState(0, state.xy(0.45,0.4), function(err, result) { });
	}
}

intervalID = setInterval(function() {
	getCurrentOrderStatus();
}, 10000);
