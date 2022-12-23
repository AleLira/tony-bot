FROM node:lts-alpine

WORKDIR /home/app

COPY . ./

RUN yarn

RUN yarn build

CMD ["yarn", "start"]