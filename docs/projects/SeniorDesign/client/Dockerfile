FROM node:18.17.1-alpine
WORKDIR /app
COPY package*.json ./
RUN npm i --legacy-peer-deps
COPY . .


ENV CHOKIDAR_USEPOLLING=true
ENV WATCHPACK_POLLING=true
CMD ["npm", "run", "start"]