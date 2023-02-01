# (re)build image:
# docker build --no-cache --tag cokicurtin/ries:latest .
# docker image prune
#
# push image to dockerhub
# docker login
# docker push cokicurtin/ries:latest
#
# run container
# docker run --rm -it cokicurtin/ries:latest
#
# run container with local files
# docker run --rm -it --name ries \
#  --volume ${PWD}/setup:/app/setup \
#  --volume ${PWD}/data:/app/data \
# cokicurtin/ries:latest ries config_test
FROM alpine:3.16.2
WORKDIR /app
RUN apk update && apk upgrade \
&& apk add git curl unzip nano nodejs npm \
&& git clone https://github.com/Curtin-Open-Knowledge-Initiative/coki-ries.git /app \
&& npm install -g pnpm && pnpm audit --fix && pnpm install \
&& echo -e "#!/bin/sh\nnode /app \"\$@\"" > /usr/local/bin/ries \
&& chmod 755 /usr/local/bin/ries
CMD sh
