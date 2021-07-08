FROM node:14-alpine
WORKDIR /usr/v3
COPY package.json ./

RUN apk add  --no-cache ffmpeg
RUN yarn

COPY . .
CMD ["yarn", "start"]
