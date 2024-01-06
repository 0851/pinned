build:
	rm -rf dist
	zip Pinned.zip -x "dist*" -x ".idea*" -x ".DS_Store"  -r . ;
	mkdir dist
	mv Pinned.zip dist/Pinned.zip