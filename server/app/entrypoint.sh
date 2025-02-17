#!/bin/sh

# Debug information
echo "Debugging information:"
cd ../
cd app/

# Print working directory and structure
echo "==== CURRENT DIRECTORY ===="
pwd
# echo "\n==== DIRECTORY STRUCTURE FROM ROOT ===="
# ls -R /
echo "\n==== DIRECTORY STRUCTURE FROM /server ===="
ls -R /server
echo "\n==== DIRECTORY STRUCTURE FROM /app ===="
ls -R /app
echo "\n==== PYTHON PATH ===="
echo $PYTHONPATH
echo "\n==== ENVIRONMENT VARIABLES ===="
env

# Wait for MongoDB connections
echo "\n==== CHECKING MONGODB CONNECTIONS ===="
until mongosh --host mongo1 --port 27017 --eval "db.adminCommand('ping')" > /dev/null 2>&1; do
  >&2 echo "Main MongoDB (mongo1:27017) is unavailable - sleeping"
  sleep 1
done

until mongosh --host mongo2 --port 27017 --eval "db.adminCommand('ping')" > /dev/null 2>&1; do
  >&2 echo "Historical MongoDB (mongo2:27017) is unavailable - sleeping"
  sleep 1
done

# Check if the install flag exists
if [ ! -f ".installed" ]; then
  echo "\n==== RUNNING INSTALL SCRIPT ===="
  python install.py
  touch .installed
else
  echo "\n==== INSTALL SCRIPT ALREADY RUN ===="
fi

echo "\n==== STARTING FLASK APP ===="
# Start the Flask application
cd app/ # This is here because I had a hilariously bad time starting app
exec gunicorn -b 0.0.0.0:5000 app:app