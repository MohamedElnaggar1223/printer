# Use an official Node runtime as a parent image
FROM node:20

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install application dependencies
RUN npm install

# Install additional required packages, Puppeteer dependencies, and supervisor
RUN apt-get update && apt-get install -y \
    apt-transport-https \
    ca-certificates \
    fonts-liberation \
    libappindicator3-1 \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcups2 \
    cups \
    cups-bsd \
    cups-client \
    libcups2-dev \
    supervisor \
    --no-install-recommends && \
    rm -rf /var/lib/apt/lists/*

# Install Puppeteer Chrome browser
RUN npx puppeteer install

# Copy the application code
COPY . .

# Copy the supervisor configuration file
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Expose the port the app runs on
EXPOSE 3001

# Start supervisor to manage CUPS and the Node.js application
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf", "-n"]