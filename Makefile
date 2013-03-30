.PHONY: test clean

test: install
	python -m SimpleHTTPServer

clean:
	git clean -qXdff
