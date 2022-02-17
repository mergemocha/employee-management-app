FROM node:alpine

ARG INSTALLDIR=/opt/employee-management-app

RUN mkdir ${INSTALLDIR}
COPY --chown=node:node . ${INSTALLDIR}
WORKDIR ${INSTALLDIR}
RUN npm ci
RUN npm run build

CMD [ "node", "." ]
