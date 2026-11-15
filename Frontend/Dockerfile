#base image
FROM node:22-alpine

#working diretory
WORKDIR /app

#copy all the dependence

COPY package*.json ./

#install all the dependences

RUN npm ci

#copy all the files
COPY . .


#expose the port
EXPOSE 5173

#cmd to start the conatiner

CMD [ "npm","run","dev","--","--host","0.0.0.0" ]

