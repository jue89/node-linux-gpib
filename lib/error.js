const errorCodes = [
	['EDVR', 'A system call has failed.'],
	['ECIC', 'Your interface board needs to be controller-in-charge, but is not.'],
	['ENOL', 'You have attempted to write data or command bytes, but there are no listeners currently addressed.'],
	['EADR', 'The interface board has failed to address itself properly before starting an io operation.'],
	['EARG', 'One or more arguments to the function call were invalid.'],
	['ESAC', 'The interface board needs to be system controller, but is not.'],
	['EABO', 'A read or write of data bytes has been aborted, possibly due to a timeout or reception of a device clear command.'],
	['ENEB', 'The GPIB interface board does not exist, its driver is not loaded, or it is not configured properly.'],
	['EDMA', 'Not used (DMA error), included for compatibility purposes.'],
	[],
	['EOIP', 'Function call can not proceed due to an asynchronous IO operation in progress.'],
	['ECAP', 'Incapable of executing function call, due the GPIB board lacking the capability, or the capability being disabled in software.'],
	['EFSO', 'File system error.'],
	[],
	['EBUS', 'An attempt to write command bytes to the bus has timed out.'],
	['ESTB', 'One or more serial poll status bytes have been lost. This can occur due to too many status bytes accumulating (through automatic serial polling) without being read.'],
	['ESRQ', 'The serial poll request service line is stuck on. This can occur if a physical device on the bus requests service, but its GPIB address has not been opened by any process. Thus the automatic serial polling routines are unaware of the device\'s existence and will never serial poll it.'],
	[],
	[],
	[],
	['ETAB', '']
];

class IBError extends Error {

	constructor( code ) {
		super( errorCodes[code].join( ': ' ) );
		this.errcode = code;
	}

}

module.exports = IBError;
