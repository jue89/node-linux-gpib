'use strict';

const Controller = require( './lib/controller.js' );

module.exports = function( board_index ) {
	return new Controller( board_index );
}
