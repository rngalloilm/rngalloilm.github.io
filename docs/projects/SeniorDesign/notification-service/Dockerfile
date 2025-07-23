FROM node:alpine
WORKDIR /app
COPY ./notification-service/package*.json ./
RUN npm i
COPY ./notification-service ./
COPY ./server/models ./models
COPY ./server/database ./database

CMD ["node", "notification-service.js"]