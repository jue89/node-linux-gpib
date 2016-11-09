#include <nan.h>

#include "ibdev.h"
#include "ibwrt.h"
#include "ibrd.h"


NAN_MODULE_INIT( init ) {
	NAN_EXPORT( target, ibdev );
	NAN_EXPORT( target, ibwrt );
	NAN_EXPORT( target, ibrd );
}

NODE_MODULE( libgpib, init )
