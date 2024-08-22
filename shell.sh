#!/bin/sh

echo "Starting CUPS service..."
/usr/sbin/cupsd -f &

# Ensure CUPS has fully started
echo "Waiting for CUPS to fully start..."
sleep 10

# Check if CUPS is running
if ps aux | grep -v grep | grep cupsd; then
    echo "CUPS started successfully"
else
    echo "Failed to start CUPS"
    # Capture and display logs
    echo "Attempting to capture CUPS logs..."
    cat /var/log/cups/error_log
    exit 1
fi

echo "Starting Node.js application..."
npm start