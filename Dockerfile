FROM node:14-alpine
WORKDIR /usr/v3
COPY package.json ./

RUN npm install

COPY . .
CMD ["npm", "start"]