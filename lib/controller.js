'use strict';

const jsonGate = require( 'json-gate' );
const Device = require( './device.js' );
const Semaphore = require( './semaphore.js' );


const schemaConsturctor = jsonGate.createSchema( {
	type: 'integer',
	minimum: 0,
	default: 0
} );

class Controller {

	constructor( board_index ) {

		schemaConsturctor.validate( board_index );

		// Store board index
		this._board_index = board_index;

		// Create a store for connected devices
		this._devices = [];

		// Create semaphore for hardware access
		this._sem = new Semaphore( 1 );

	}

	connect( dev ) {

		let d = new Device( this._board_index, dev, this._sem );
		this._devices.push( d );
		return d;

	}

	disconnectAll() {

		let jobs = [];
		this._devices.forEach( ( dev ) => jobs.push( dev.disconnect() ) );
		return Promise.all( jobs ).catch( ( e ) => { /* Ignore errors */ } );

	}

}

module.exports = Controller;
