#base image
FROM node:22-alpine
#working direactory

WORKDIR /app

#copy all the package.json file
COPY package*.json ./

#install all the dependences

RUN npm ci

#copy all the files

COPY . .

#backend port
EXPOSE 4000

#CMD TO RUN THE SERVER

CMD [ "node","server.js" ]
