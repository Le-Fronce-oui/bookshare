FROM lfo/bs-front:latest

FROM lfo/bs-back:latest

RUN apk update && apk add nginx

COPY docker/nginx/full.conf /etc/nginx/nginx.conf
COPY docker/nginx/conf/proxy.conf /etc/nginx/proxy.conf

RUN mkdir /front
WORKDIR /front

COPY --from=0 /front .

WORKDIR /back

ENTRYPOINT nginx && npm run start