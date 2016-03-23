var serialport = require("serialport");
var SerialPort = serialport.SerialPort; // localize object constructor

var MongoClient = require('mongodb').MongoClient
, assert = require('assert');

// Connection URL
var url = 'mongodb://localhost:27017/myproject';

var readings = [];
var lastTs = 0;

// Use connect method to connect to the Server
MongoClient.connect(url, function(err, db) {
	assert.equal(null, err);
	console.log("Connected correctly to server");

	serialport.list(function (err, ports) {
		ports.forEach(function(port) {
			if (port.manufacturer) {
				if (port.manufacturer.indexOf('Arduino') > -1) {
					console.log('Arduino found, connecting.......');
					var sp = new SerialPort(port.comName, {
						parser: serialport.parsers.readline("\n"),
						baudrate: 9600
					}, false); 

					sp.open(function (error) {
						if ( error ) {
							console.log('failed to open: '+error);
						} else {
							console.log('opened connection:');
							sp.on('data', function(data) {
								if (data.indexOf(":") > -1) {
									if (Date.now() - lastTs > 10000) {
										console.log('data received: ', data.split(":")[0]);
										readings.push(data.split(":")[0]);
										lastTs = Date.now();
										var collection = db.collection('powerConsumption');
										var sum = 0;
										readings.forEach( function (content, index, array) {
											sum+=parseInt(content);
										});
										collection.insert({ 'timestamp' : Date.now(), 'consumption' : parseFloat((sum/readings.length).toFixed(2)) }, function (err, result) {});
										console.log('sum', sum);
										console.log('average: ' + parseFloat((sum/readings.length).toFixed(2)));
										readings.length = 0;
									} else { // add reading and use it for avg
										console.log('data received: ', data.split(":")[0]);
										readings.push(data.split(":")[0]);
									}
								}
							});
						}
					});
				}
				console.log(port.manufacturer);
			}
		});
	});

});



