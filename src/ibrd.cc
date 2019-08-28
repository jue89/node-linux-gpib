#include "ibrd.h"

#define CHUNK_SIZE 4096

class ibrdWorker : public Nan::AsyncWorker {
	private:
		int ud;
		char *buffer;
		long len;
		int err;
		int status;
		long bytesRead;

		bool extendBuffer() {
			len += CHUNK_SIZE;
			void *p = realloc( buffer, len );
			if( p == NULL ) return false;
			buffer = (char *) p;
			return true;
		}

	public:
		ibrdWorker( Nan::Callback *callback, int ud ) : AsyncWorker( callback ), ud( ud ) {
			bytesRead = 0;
			len = CHUNK_SIZE;
			buffer = (char *) malloc( len );
		}

		~ibrdWorker() {}

		void Execute() {

			while( true ) {
				// Read one chunk
				status = ibrd( ud, (void *) ( buffer + len - CHUNK_SIZE ), CHUNK_SIZE );

				// Sum read bytes
				bytesRead += ibcntl;

				// If END is set, we're done here!
				// And if ERR is set, break the whole thing.
				if( status & 0x2000 || status & 0x8000 ) break;

				// Otherwise reallocate another chunk and read further bytes
				if( ! extendBuffer() ) break;
			}

			// Store error variable
			err = iberr;

		}

		void HandleOKCallback() {

			// Create string termination
			// If buffer is full, make room for the termination
			if( len == bytesRead ) {
				// If extending the buffer failed, overwrite last byte with \0
				if( ! extendBuffer() ) bytesRead--;
			}
			buffer[bytesRead] = 0;

			v8::Local<v8::Value> argv[] = {
				Nan::New<v8::Number>( err ),
				Nan::New<v8::Number>( status ),
				Nan::New<v8::String>( buffer ).ToLocalChecked()
			};

			free( buffer );

			callback->Call( 3, argv );

		}
};

NAN_METHOD( ibrd ) {

        v8::Local<v8::Context> context = info.GetIsolate()->GetCurrentContext();

        int ud = info[0]->Int32Value(context).FromJust();

	Nan::Callback *callback = new Nan::Callback( info[1].As<v8::Function>() );

	Nan::AsyncQueueWorker( new ibrdWorker( callback, ud ) );

}
