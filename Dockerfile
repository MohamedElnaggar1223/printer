# Use an official Node runtime as a parent image
FROM node:18

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install application dependencies
RUN npm install

# Install additional required packages and Puppeteer dependencies
RUN apt-get update && apt-get install -y \
    apt-transport-https \
    ca-certificates \
    fonts-liberation \
    libappindicator3-1 \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcups2 \
    libdbus-1-3 \
    libgdk-pixbuf2.0-0 \
    libnspr4 \
    libnss3 \
    libxcomposite1 \
    libxrandr2 \
    wget \
    xdg-utils \
    cups \
    cups-bsd \
    cups-client \
    libcups2-dev \
    --no-install-recommends && \
    rm -rf /var/lib/apt/lists/*

# Install Puppeteer Chrome browser
RUN npx puppeteer install

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 3001

# Define the command to run the application
CMD ["node", "index.js"]