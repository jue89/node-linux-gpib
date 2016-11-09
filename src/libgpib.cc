#include <nan.h>

#include "ibdev.h"
#include "ibwrt.h"
#include "ibrd.h"
#include "ibonl.h"


NAN_MODULE_INIT( init ) {
	NAN_EXPORT( target, ibdev );
	NAN_EXPORT( target, ibwrt );
	NAN_EXPORT( target, ibrd );
	NAN_EXPORT( target, ibonl );
}

NODE_MODULE( libgpib, init )
