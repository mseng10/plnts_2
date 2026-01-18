#!/bin/bash
set -e

echo "==== STARTING APPLICATION ===="
echo "Working directory: $(pwd)"
echo "Contents of /app:"
ls -la /app

# Wait for MongoDB to be ready with authentication
echo "==== WAITING FOR MONGODB ===="
max_attempts=30
attempt=0

while [ $attempt -lt $max_attempts ]; do
    if mongosh --host mongo --port 27017 \
        --username admin \
        --password password \
        --authenticationDatabase admin \
        --eval "db.adminCommand('ping')" > /dev/null 2>&1; then
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