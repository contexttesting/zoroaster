FROM alpine:3.5

ENTRYPOINT ["nginx", "-c",  "/nginx.conf"]

RUN apk add --no-cache nginx
ADD nginx.conf /

COPY build /app
