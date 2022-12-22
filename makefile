
org = lfo


all: back front-build front full


back:
	cd backend && docker build . -t $(org)/bs-$@

front-build:
	docker build . -f Dockerfile-build -t $(org)/bs-$@

front:
	cd frontend && docker build . -t $(org)/bs-$@

full:
	docker build . -t $(org)/bs-$@


install:
	cd frontend && npm i
	cd backend  && npm i

clear:
	rm -r frontend/dist
	rm -r backend/build
