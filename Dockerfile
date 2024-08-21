# Use an official Node runtime as a parent image
FROM node:20

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install application dependencies
RUN npm install

# Install CUPS and its dependencies
RUN apt-get update && apt-get install -y \
    cups \
    cups-bsd \
    cups-client \
    libcups2-dev \
    --no-install-recommends && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Copy the application code
COPY . .

# Copy the start script
COPY start.sh /start.sh
RUN chmod +x /start.sh

# Expose the port the app runs on
EXPOSE 3001

# Command to run the start script
CMD ["/start.sh"]