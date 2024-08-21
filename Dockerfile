# Use an official Node runtime as a parent image
FROM node:18

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Install additional required packages
RUN apt-get update && apt-get install -y cups-bsd

# Expose the port the app runs on
EXPOSE 3001

# Define the command to run the application
CMD ["node", "index.js"]