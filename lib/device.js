const jsonGate = require( 'json-gate' );
const libgpib = require( '../build/Release/gpib.node' );
const Status = require( './status.js' );
const IBError = require( './error.js' );

const timeoutConstants = [
	'TNONE',
	'T10us',
	'T30us',
	'T100us',
	'T300us',
	'T1ms',
	'T3ms',
	'T10ms',
	'T30ms',
	'T100ms',
	'T300ms',
	'T1s',
	'T3s',
	'T10s',
	'T30s',
	'T100s',
	'T300s',
	'T1000s'
];

const schemaConnect = jsonGate.createSchema( {
	type: 'object',
	additionalProperties: false,
	required: true,
	properties: {
		pad: {
			type: 'integer',
			required: true,
			minimum: 0,
			maximum: 30
		},
		sad: {
			type: 'integer',
			minimum: 0,
			maximum: 30,
			default: 0
		},
		timeout: {
			type: 'string',
			enum: timeoutConstants,
			default: 'T300ms'
		},
		send_eoi: {
			type: 'boolean',
			default: true
		},
		eos: {
			type: 'integer',
			default: 0,
			minimum: 0,
			maximum: 255
		}
	}
} );


class Device {

	constructor( board_index, dev, sem ) {

		schemaConnect.validate( dev );

		this.sem = sem;

		// Convert timeout and send_eoi to int
		dev.timeout = timeoutConstants.indexOf( dev.timeout );
		dev.send_eoi = dev.send_eoi ? 1 : 0;

		// Create handle
		this._ud = libgpib.ibdev(
			board_index,
			dev.pad,
			dev.sad,
			dev.timeout,
			dev.send_eoi,
			dev.eos
		);

		if( this._ud == -1 ) throw new Error( `Cannot connect to PAD ${dev.pad}` );

	}

	_getUD() {
		if( this._ud == -1 ) throw new Error( "Not connected to a device" );
		return this._ud;
	}

	disconnect() {
		return this.sem.take().then( () => {
			// Disconnect form device
			const status = libgpib.ibonl( this._getUD() );
			this._ud = -1;

			// Free resources and return status
			this.sem.leave();
			return new Status( status );
		} );
	}

	write( data ) {
		return this.sem.take().then( () => new Promise( ( resolve, reject ) => {

			libgpib.ibwrt( this._getUD(), data.toString(), ( err, status, bytesWritten ) => {
				status = new Status( status );

				// Free resources
				this.sem.leave();

				if( status.ERR ) {
					// If error bit is set, throw a new error
					reject( new IBError( err ) );
				} else {
					// Otherwise return written bytes and status
					resolve( bytesWritten );
				}
			} );

		} ) );
	}

	read() {
		return this.sem.take().then( () => new Promise( ( resolve, reject ) => {

			libgpib.ibrd( this._getUD(), ( err, status, data ) => {
				status = new Status( status );

				// Free resources
				this.sem.leave();

				if( status.ERR ) {
					// If error bit is set, throw a new error
					reject( new IBError( err ) );
				} else {
					// Otherwise return data
					resolve( data );
				}
			} );

		} ) );
	}

	query( cmd ) {
		// Write cmd to device and try to read data back
		return this.write( cmd ).then( () => {
			return this.read()
		} );
	}

}

module.exports = Device;
