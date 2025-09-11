# Use the official Node.js LTS image
FROM node:lts

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port the application listens on
EXPOSE 3000

# Start the server
CMD ["npm", "start"]