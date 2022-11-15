# build image:
# docker build --tag coki:latest .
#
# run container with local files
# docker run -it --name coki \
#   --volume ${PWD}/conf:/app/conf \
#   --volume ${PWD}/data:/app/data \
# coki:latest
# node /app/code/cli/compile_all.js

FROM alpine:3.16.2
WORKDIR /app
RUN apk update && apk upgrade \
&& apk add unzip curl git nano nodejs npm \
&& npm install -g pnpm \
&& curl https://storage.googleapis.com/rt-era-public/code/release/ries/latest.zip -o code.zip \
&& unzip code.zip && rm code.zip \
&& npm install -g pnpm && pnpm install && pnpm audit
CMD sh
