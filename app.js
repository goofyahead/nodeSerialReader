var serialport = require("serialport");
var SerialPort = serialport.SerialPort; // localize object constructor

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
							console.log('data received: ' + data);
						});
					}
				});
			}
			console.log(port.manufacturer);
		}
	});
});

