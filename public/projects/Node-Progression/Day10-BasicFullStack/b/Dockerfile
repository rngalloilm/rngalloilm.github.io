FROM node:lts
WORKDIR /app

COPY package*.json ./

RUN npm install
RUN npm install --save-dev nodemon

COPY . .

EXPOSE 3000

CMD ["npm", "start"]