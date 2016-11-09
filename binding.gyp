{
	"targets": [ {
		"target_name": "libgpib",
		"sources": [
			"src/libgpib.cc",
			"src/ibdev.cc",
			"src/ibwrt.cc",
			"src/ibrd.cc"
		],
		"include_dirs": [ "<!(node -e \"require('nan')\")" ],
		"libraries":
			[ "<!@(pkg-config --libs-only-l libgpib)" ]
	} ]
}
