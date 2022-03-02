FROM node:latest

ARG INSTALLDIR=/opt/employee-management-app-backend

RUN mkdir ${INSTALLDIR}
WORKDIR ${INSTALLDIR}

CMD [ "node", "." ]

RUN apt-get update
RUN apt-get install -y curl jq

COPY package*.json ${INSTALLDIR}
RUN npm ci

COPY --chown=node:node . ${INSTALLDIR}
