FROM node:lts-alpine

WORKDIR /web

COPY package*.json ./

COPY client/package*.json client/
RUN npm run install-client 

COPY server/package*.json server/
RUN npm run install-server 

COPY client/ client
RUN npm run build --prefix client

USER node

COPY server/ server/
CMD ["npm","start","--prefix","server"]

EXPOSE 8000