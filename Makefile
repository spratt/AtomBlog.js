.PHONY: test clean

test: 
	python -m SimpleHTTPServer

clean:
	git clean -qXdff
