FROM node:20-alpine

WORKDIR /code

COPY package.json yarn.lock requirements.txt ./

RUN yarn install
RUN while read p; do yarn add $p; done < requirements.txt

# Bundle app source
COPY . /code

EXPOSE 8080
CMD [ "yarn", "run", "dev" ]
