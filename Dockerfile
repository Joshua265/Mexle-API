# pull official base image
FROM node:12.20.1-alpine

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install app dependencies
COPY package.json ./
RUN npm install --silent
RUN npm install pm2 -g --silent

# add app
COPY . ./

EXPOSE 80

# start app
CMD [ "pm2-runtime", "start", "ecosystem.config.js"]
