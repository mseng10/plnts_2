#!/bin/sh

# Debug information
echo "Debugging information:"
ls -la /app

# Wait for the database to be ready
until PGPASSWORD=$POSTGRES_PASSWORD psql -h "db" -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c '\q'; do
  >&2 echo "Postgres is unavailable - sleeping"
  sleep 1
done
>&2 echo "Postgres is up - executing command"

# Check if the install flag exists
if [ ! -f "/app/.installed" ]; then
  echo "Running install script..."
  python install.py
  touch /app/.installed
else
  echo "Install script already run, skipping..."
fi

# Start the Flask application
echo "Starting Flask app..."
exec gunicorn -b 0.0.0.0:5000 app:app