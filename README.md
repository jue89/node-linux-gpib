# Linux GPIB

The brand new General Purpose Interface Bus (GPIB, IEC-625-Bus), introduced by Hewlet-Packard in the late 1960s, can be accessed via [linux-gpib](http://linux-gpib.sourceforge.net/). This module offers native bindings to the very fundamental read and write methods (```ibrd()``` and ```ibwrt()```). So if you want to access your lab bench devices using JavaScript, this module will be your solution.

## Example

``` javascript
const GPIB = require( 'linux-gpib' );

// Connect to GPIB interface available at /dev/gpib0
const gpib = GPIB( 0 );

// And finally connect to your GPIB device with primary address 27
specAnalyser = gpib.connect( { pad: 27 } );

// In this example its a Rohde & Schwarz FSP specturm analyser. We want to fetch
// the points recorded on TRACE1. So we transmit the command accordingly the
// user's manual.
specAnalyser.write( 'trac1? trace1' ).then( () => {

	// And read back from GPIB
	return specAnalyser.read();

} ).then( ( response ) => {

	// The data is transmitted as a string separated by commas. Convert them
	// into floats.
	let data = [];
	response.split(',').forEach( ( v ) => data.push( parseFloat( v ) ) );
	return data;

} ).then( ( data ) => {

	// Output data
	console.log( data );

	// Disconenct from device
	return specAnalyser.disconnect();

} ).catch( ( err ) => {

	// Something went wrong!
	console.error( err.message );

} );
```

## API


## Requirements

Beside a GPIB-capbale measurement instrument you need a GPIB interface that is compatibile with linux-gpib. Furthermore linux-gpib must be installed and the GPIB-device must be fully configured. (Some of them need a firmware downloaded onto the device before beeing used. Google is your friend!)
