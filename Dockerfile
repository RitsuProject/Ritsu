FROM node:12
WORKDIR /usr/ritsu
COPY package.json ./

RUN npm install

COPY . .
CMD ["node", "."]