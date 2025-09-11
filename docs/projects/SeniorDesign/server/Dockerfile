FROM node:alpine
WORKDIR /app
COPY package*.json ./
RUN npm i
COPY ./ ./

COPY wait-for.sh /wait-for.sh
RUN chmod +x /wait-for.sh

CMD ["/wait-for.sh", "mysql_db:3306", "--", "node", "index.js"]
#CMD ["npm", "test"] -- For testing
#"node", "index.js" -- For Running Normally