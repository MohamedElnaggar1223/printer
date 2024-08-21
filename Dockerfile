FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN apt-get update && apt-get install -y --no-install-recommends \
    cups \
    cups-bsd \
    cups-client \
    libcups2-dev \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

COPY . .

COPY shell.sh /shell.sh
RUN chmod +x /shell.sh

EXPOSE 3001

CMD ["/shell.sh"]