#include "ibonl.h"

NAN_METHOD( ibonl ) {

	v8::Local<v8::Context> context = info.GetIsolate()->GetCurrentContext();

	int ud = info[0]->Int32Value(context).FromJust();

	int ret = ibonl( ud, 0 );

	info.GetReturnValue().Set( Nan::New( ret ) );

}
