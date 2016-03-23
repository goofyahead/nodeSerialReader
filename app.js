var serialport = require("serialport");
var SerialPort = serialport.SerialPort; // localize object constructor

var sp = new SerialPort("/dev/cu.usbmodem1421", {
	parser: serialport.parsers.readline("\n"),
	baudrate: 9600
}, false); 

sp.open(function (error) {
	if ( error ) {
		console.log('failed to open: '+error);
	} else {
		console.log('open');
		sp.on('data', function(data) {
			console.log('data received: ' + data);
		});
    // serialPort.write("ls\n", function(err, results) {
    //   console.log('err ' + err);
    //   console.log('results ' + results);
    // });
}
});