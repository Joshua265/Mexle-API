# pull official base image
FROM node:12.20.1-alpine

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install app dependencies
COPY package.json ./
RUN npm install

# add app
COPY . ./

EXPOSE 80

# start app
CMD ["node", "app.js"]
