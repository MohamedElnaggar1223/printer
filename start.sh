#!/bin/sh

# Start the CUPS service
echo "Starting CUPS service..."
/usr/sbin/cupsd -f &

# Ensure CUPS has fully started
echo "Waiting for CUPS to fully start..."
sleep 10

# Start the Node.js application
echo "Starting Node.js application..."
npm start