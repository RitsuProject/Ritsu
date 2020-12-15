FROM node:14
WORKDIR /usr/ritsu
COPY package.json ./

RUN npm install

COPY . .
CMD ["node", "."]