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
&& apk add git curl unzip nano nodejs npm \
&& git clone https://github.com/Curtin-Open-Knowledge-Initiative/coki-ries.git /app \
&& npm install -g pnpm && pnpm install && pnpm audit
CMD sh
