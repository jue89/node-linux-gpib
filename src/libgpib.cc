#include <nan.h>

#include "ibdev.h"


NAN_MODULE_INIT( init ) {
	NAN_EXPORT( target, ibdev );
}

NODE_MODULE( libgpib, init )
