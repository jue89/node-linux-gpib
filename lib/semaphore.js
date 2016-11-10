class Semaphore {
	constructor( capacity ) {
		if( typeof capacity != 'number' ) throw new Error( "Capacity must be a number" );
		this.tokens = capacity;
		this.stack = [];
	}

	_handleStack() {
		// If we have tokens and processes are in the queue, execute them
		while( this.tokens > 0 && this.stack.length ) {
			this.tokens--;
			this.stack.shift()();
		}
	}

	take() {
		return new Promise( ( resolve ) => {
			// Push job to stack
			this.stack.push( resolve );
			this._handleStack();
		} );
	}

	leave() {
		// Increase tokens
		this.tokens++;
		this._handleStack();
	}
}

module.exports = Semaphore;
