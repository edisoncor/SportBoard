#!/bin/bash

set -e

echo "Starting SportBoard Auth Service..."

# Wait for database to be ready
echo "Waiting for database..."
echo "Trying to connect to database at auth-database:5432..."
for i in {1..30}; do
  if nc -z auth-database 5432; then
    echo "Database is ready!"
    break
  fi
  echo "Database not ready yet, waiting... (attempt $i/30)"
  sleep 2
done

if ! nc -z auth-database 5432; then
  echo "ERROR: Database is not available after 60 seconds"
  exit 1
fi

# Wait for RabbitMQ to be ready
echo "Waiting for RabbitMQ..."
while ! nc -z rabbitmq 5672; do
  sleep 0.1
done
echo "RabbitMQ started"

# Create logs directory if it doesn't exist (must be done before Django commands)
echo "Creating logs directory..."
mkdir -p logs
mkdir -p core/logs

# Create migrations and migrate (comandos originales importantes)
echo "Creating migrations..."
python manage.py makemigrations --no-input

echo "Running database migrations..."
python manage.py migrate --no-input

# Load fixtures (comando original importante)
echo "Loading fixtures..."
python manage.py loaddata */fixtures/*.json || echo "No fixtures found or already loaded"

# Clean up old files (comandos originales importantes)
echo "Cleaning up old files..."
rm -f celerybeat.pid
rm -f logs/debug.log

# Create superuser if it doesn't exist (only in production)
# Commented out to avoid conflicts during migration setup
# if [ "$ENVIRONMENT" = "prod" ]; then
#     echo "Creating superuser if needed..."
#     python manage.py createsuperuser --noinput --email admin@gmail.com || echo "Superuser creation skipped"
# fi

# Collect static files
echo "Collecting static files..."
python manage.py collectstatic --noinput

echo "Starting application..."
exec "$@"
