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
		this.board_index = board_index;

		// Create semaphore for hardware access
		this.sem = new Semaphore( 1 );

	}

	connect( dev ) {

		return new Device( this.board_index, dev, this.sem );

	}

}

module.exports = Controller;
