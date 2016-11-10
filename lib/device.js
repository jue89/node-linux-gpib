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
		this.ud = libgpib.ibdev(
			board_index,
			dev.pad,
			dev.sad,
			dev.timeout,
			dev.send_eoi,
			dev.eos
		);

		if( this.ud == -1 ) throw new Error( `Cannot connect to PAD ${dev.pad}` );

	}

	_checkCon() {
		if( this.ud == -1 ) throw new Error( "Not connected to a device" );
	}

	disconnect() {
		return this.sem.take().then( () => {
			// Make sure we are still connected
			this._checkCon();

			// Disconnect form device
			const status = libgpib.ibonl( this.ud );
			this.ud = -1;

			// Free resources and return status
			this.sem.leave();
			return new Status( status );
		} );
	}

	write( data ) {
		return this.sem.take().then( () => new Promise( ( resolve, reject ) => {
			// Make sure we are still connected
			this._checkCon();

			libgpib.ibwrt( this.ud, data.toString(), ( err, status, bytesWritten ) => {
				status = new Status( status );

				// Free resources
				this.sem.leave();

				if( status.ERR ) {
					// If error bit is set, throw a new error
					reject( new IBError( err ) );
				} else {
					// Otherwise return written bytes and status
					resolve( [ status, bytesWritten ] );
				}
			} );

		} ) );
	}

}

module.exports = Device;
