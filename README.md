# Linux GPIB

The brand new General Purpose Interface Bus (GPIB, IEC-625-Bus), introduced by Hewlet-Packard in the late 1960s, can be accessed via [linux-gpib](http://linux-gpib.sourceforge.net/). This module offers native bindings to the very fundamental read and write methods (```ibrd()``` and ```ibwrt()```). So if you want to access your lab bench devices using JavaScript, this module will be your solution.

## Example

``` javascript
const GPIB = require( 'linux-gpib' );

// Connect to GPIB interface available at /dev/gpib0
const gpib = GPIB( 0 );

// And finally connect to your GPIB device with primary address 20
let specAnalyser = gpib.connect( { pad: 20 } );

// In this example its a Rohde & Schwarz FSP specturm analyser. We want to fetch
// the points recorded on TRACE1. So we transmit the command accordingly the
// user's manual.
specAnalyser.query( 'trac1? trace1' ).then( ( response ) => {

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

The native bindings can be accessed as follows. The API documentation refers to GPIB.
``` javascript
const GPIB = require( 'linux-gpib' );
```

### GPIB

``` javascript
const gpib = GPIB( minor );
```

Connects to a GPIB adapter available at ```/dev/gpib[minor]``` and returns an instance of GPIB.

### Class: GPIB

#### Method: connect

``` javascript
const dev = gpib.connect( device );
```

Connects to the device described in ```device``` and returns an instance of Device.

```device``` has the following properties:
 * ```pad```: Primary GPIB address of the device.
 * ```device```: (optional) Secondary GPIB address.
 * ```timeout```: (optional) Timoeout for I/O operations. Possible values: "TNONE", "T10us", "T30us", "T100us", "T300us", "T1ms", "T3ms", "T10ms", "T30ms", "T100ms", "T300ms", "T1s", "T3s", "T10s", "T30s", "T100s", "T300s", "T1000s". Default: "T300ms".
 * ```send_eoi```: (optional) Assert EOI line with last transmitted byte. Default: true.
 * ```eos```: (optional) end-of-string mode. Default: 0x0.

#### Method: disconnectAll

``` javascript
gpib.disconnectAll().then( ... );
```

Disconnects from all connected devices. Returns a promise.

### Class: Device

#### Method: write

``` javascript
dev.write( data ).then( ... );
```

Sends data to the connected device. Returns a promise. If ```data``` is a string, it is just transmitted. If ```data``` is an array, each item is successively transmitted, starting with the first item.

#### Method: read

``` javascript
dev.read().then( ... );
```

Reads data from the connected device. Returns a promise that will be resolved with the recieved data.

#### Method: query

``` javascript
dev.query( data ).then( ... );
```

Fristly writes data to and then reads data from the connected device. Returns a promise that will be resolved with the recieved data.

#### Method: disconnect

``` javascript
dev.disconnect( goToLocalMode ).then( ... );
```

Disconencts from device. Returns a promise. If ```goToLocalMode``` is true (default), it will bring the device back to local mode before disconnecting.


## Requirements

Beside a GPIB-capbale measurement instrument you need a GPIB interface that is compatibile with linux-gpib. Furthermore linux-gpib must be installed and the GPIB-device must be fully configured. (Some of them need a firmware downloaded onto the device before beeing used. Google is your friend!)

Node.js must be available in version 4 or later.
