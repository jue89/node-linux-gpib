#include "ibdev.h"

NAN_METHOD( ibdev ) {

	int board    = ( info[0]->ToInteger() )->Value();
	int pad      = ( info[1]->ToInteger() )->Value();
	int sad      = ( info[2]->ToInteger() )->Value();
	int timeout  = ( info[3]->ToInteger() )->Value();
	int send_eoi = ( info[4]->ToInteger() )->Value();
	int eos      = ( info[5]->ToInteger() )->Value();

	int ret = ibdev( board, pad, sad, timeout, send_eoi, eos );

	info.GetReturnValue().Set( Nan::New( ret ) );

}
