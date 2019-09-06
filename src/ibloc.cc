#include "ibloc.h"

NAN_METHOD( ibloc ) {

	v8::Local<v8::Context> context = info.GetIsolate()->GetCurrentContext();

	int ud = info[0]->Int32Value(context).FromJust();

	int ret = ibloc( ud );

	info.GetReturnValue().Set( Nan::New( ret ) );

}
