#!/bin/sh

echo "Starting CUPS service..."
/usr/sbin/cupsd -f &

sleep 10

# Ensure CUPS started correctly
if ps aux | grep -v grep | grep cupsd; then
   echo "CUPS started successfully"
else
   echo "Failed to start CUPS"
   exit 1
fi

echo "Starting Node.js application..."
npm start