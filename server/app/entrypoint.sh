#!/bin/bash
set -e
 
echo "==== STARTING APPLICATION ===="
echo "Working directory: $(pwd)"
echo "Contents of /app:"
ls -la /app
 
# Wait for MongoDB to be ready (TCP check)
echo "==== WAITING FOR MONGODB ===="
max_attempts=30
attempt=0
 
while [ $attempt -lt $max_attempts ]; do
    if python3 -c "import socket; s = socket.create_connection(('mongo', 27017), timeout=2); s.close()" 2>/dev/null; then
        echo "MongoDB is ready!"
        break
    fi
    attempt=$((attempt + 1))
    echo "MongoDB not ready yet (attempt $attempt/$max_attempts)..."
    sleep 2
done
 
if [ $attempt -eq $max_attempts ]; then
    echo "ERROR: MongoDB did not become ready in time"
    exit 1
fi
 
# Navigate to app directory and start Flask
echo "==== STARTING FLASK APPLICATION ===="
cd /app/app
 
exec gunicorn \
    --bind 0.0.0.0:5000 \
    --workers 4 \
    --timeout 120 \
    --log-level info \
    --access-logfile - \
    --error-logfile - \
    app:app