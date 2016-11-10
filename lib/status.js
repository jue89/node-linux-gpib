const statusBits = [
	[ 'DCAS' ],
	[ 'DTAS' ],
	[ 'LACS', 'Board is currently addressed as a listener.' ],
	[ 'TACS', 'Board is currently addressed as talker.' ],
	[ 'ATN',  'The ATN line is asserted.' ],
	[ 'CIC',  'Board is controller-in-charge, so it is able to set the ATN line.' ],
	[ 'REM',  'Board is in remote state.' ],
	[ 'LOK',  'Board is in lockout state.' ],
	[ 'CMPL', 'I/O operation is complete.' ],
	[ 'EVENT' ],
	[ 'SPOLL' ],
	[ 'RQS' ],
	[ 'SRQI' ],
	[ 'END',  'Last io operation ended with the EOI line asserted' ],
	[ 'TIMO', 'Last io operation timed out' ],
	[ 'ERR',  'Error occured' ]
];

class Status {

	constructor( status ) {

		// Store the raw status value
		this.raw = status;

		// Reflect bit set to Object
		this.bitSet = [];
		for( let mask = 0x8000, b = 15; b >= 0; mask = mask/2, b-- ) {
			if( status & mask ) {
				this.bitSet.push( statusBits[b] );
				this[statusBits[b][0]] = true;
			} else {
				this[statusBits[b][0]] = false;
			}
		}

	}

	toString() {
		let lines = [];
		this.bitSet.forEach( (b) => {
			lines.push( b.join( ": " ) );
		});
		return lines.join( "\n" );
	}

}

module.exports = Status;
