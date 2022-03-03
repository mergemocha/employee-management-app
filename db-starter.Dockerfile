FROM debian:stable-slim

ARG MONGOSH_VERSION

RUN apt-get update
RUN apt-get install -y curl

RUN curl -L https://downloads.mongodb.com/compass/mongosh-$MONGOSH_VERSION-linux-x64.tgz -o /tmp/mongosh.tgz
RUN mkdir /opt/mongosh
RUN tar -xf /tmp/mongosh.tgz -C /opt/mongosh --wildcards '**/bin/mongosh' --transform 's/.*\///g'

COPY scripts/init-db.sh /
COPY docker-entrypoint-initdb.d/mongo-post-init.js /

CMD ["bash", "/init-db.sh"]
