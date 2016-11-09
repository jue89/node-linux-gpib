#include <nan.h>

#include "ibdev.h"
#include "ibwrt.h"


NAN_MODULE_INIT( init ) {
	NAN_EXPORT( target, ibdev );
	NAN_EXPORT( target, ibwrt );
}

NODE_MODULE( libgpib, init )
