FROM node:14-alpine
WORKDIR /usr/v3
COPY package.json ./

RUN apk add  --no-cache ffmpeg
RUN yarn

ENV NODE_ENV=production

COPY . .
CMD ["yarn", "start"]
