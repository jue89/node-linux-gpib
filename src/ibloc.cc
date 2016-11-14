#include "ibloc.h"

NAN_METHOD( ibloc ) {

	int ud = info[0]->ToInteger()->Value();

	int ret = ibloc( ud );

	info.GetReturnValue().Set( Nan::New( ret ) );

}
