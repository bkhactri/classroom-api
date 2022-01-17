FROM node:16.13.2-buster

WORKDIR /code

COPY package.json package.json
COPY yarn.lock yarn.lock

RUN yarn install

COPY . .

CMD ["npm", "run", "start:docker"]