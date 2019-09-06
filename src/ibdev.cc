#include "ibdev.h"

NAN_METHOD( ibdev ) {
	v8::Local<v8::Context> context = info.GetIsolate()->GetCurrentContext();

	int board    = info[0]->Int32Value(context).FromJust();
	int pad      = info[1]->Int32Value(context).FromJust();
	int sad      = info[2]->Int32Value(context).FromJust();
	int timeout  = info[3]->Int32Value(context).FromJust();
	int send_eoi = info[4]->Int32Value(context).FromJust();
	int eos      = info[5]->Int32Value(context).FromJust();

	int ret = ibdev( board, pad, sad, timeout, send_eoi, eos );

	info.GetReturnValue().Set( Nan::New( ret ) );

}
