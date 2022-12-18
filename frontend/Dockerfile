FROM lfo/bs-front-build:latest

FROM nginx:alpine

COPY nginx.conf /etc/nginx/nginx.conf

RUN mkdir /front
WORKDIR /front

COPY --from=0 /build/dist/frontend .
