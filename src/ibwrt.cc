#include "ibwrt.h"

class ibwrtWorker : public Nan::AsyncWorker {
	private:
		int ud;
		char *data;
		int len;
		int err;
		int status;
		int bytesWritten;

	public:
		ibwrtWorker( Nan::Callback *callback, int ud, char *data, int len ) : AsyncWorker( callback ), ud( ud ), data( data ), len( len ) {}

		~ibwrtWorker() {
			free( data );
		}

		void Execute() {

			status = ibwrt( ud, (void *) data, len );
			err = iberr;
			bytesWritten = ibcnt;

		}

		void HandleOKCallback() {

			v8::Local<v8::Value> argv[] = {
				Nan::New<v8::Number>( err ),
				Nan::New<v8::Number>( status ),
				Nan::New<v8::Number>( bytesWritten )
			};

			callback->Call( 3, argv );

		}
};

NAN_METHOD( ibwrt ) {

	int ud = info[0]->ToInteger()->Value();

	v8::Local<v8::String> tmp = info[1]->ToString();
	int len = tmp->Length();
	char *data = (char *) malloc( tmp->Length() + 1 );
	tmp->WriteUtf8( data, len );

	Nan::Callback *callback = new Nan::Callback( info[2].As<v8::Function>() );

	Nan::AsyncQueueWorker( new ibwrtWorker( callback, ud, data, len ) );

}
