# (re)build image:
# docker build --no-cache --tag cokicurtin/ries:latest .
# docker image ls
#
# push image to dockerhub
# docker login
# docker push cokicurtin/ries:latest
#
# run container
# docker run --rm -it cokicurtin/ries:latest sh
#
# run container with local files
# docker run --rm -it --name ries \
#  --volume ${PWD}/setup/.config.json:/app/setup/.config.json \
#  --volume ${PWD}/setup/.access.json:/app/setup/.access.json \
#  --volume ${PWD}/data:/app/data \
# cokicurtin/ries:latest node . config_test
FROM alpine:3.16.2
WORKDIR /app
RUN apk update && apk upgrade \
&& apk add git curl unzip nano nodejs npm \
&& git clone https://github.com/Curtin-Open-Knowledge-Initiative/coki-ries.git /app \
&& npm install -g pnpm && pnpm audit --fix && pnpm install \
&& alias ries="node /app"
CMD sh
