FROM node:20-alpine

WORKDIR /code

COPY package.json yarn.lock ./

RUN yarn install

# Bundle app source
COPY . /code

EXPOSE 8080
CMD [ "yarn", "run", "dev" ]
