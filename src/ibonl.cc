#include "ibonl.h"

NAN_METHOD( ibonl ) {

	int ud = info[0]->ToInteger()->Value();

	int ret = ibonl( ud, 0 );

	info.GetReturnValue().Set( Nan::New( ret ) );

}
