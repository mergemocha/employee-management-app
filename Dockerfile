FROM node:latest

ARG INSTALLDIR=/opt/employee-management-app-backend

RUN mkdir ${INSTALLDIR}
WORKDIR ${INSTALLDIR}

CMD [ "node", "." ]

COPY package*.json ${INSTALLDIR}
RUN npm ci

COPY --chown=node:node . ${INSTALLDIR}
