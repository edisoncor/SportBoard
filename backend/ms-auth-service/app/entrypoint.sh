#!/bin/sh

echo "Starting SportBoard Auth Service..."

echo "Waiting for database..."
echo "Trying to connect to database at auth-database:5432..."
i=1
while [ $i -le 30 ]; do
  if nc -z auth-database 5432; then
    echo "Database is ready!"
    break
  fi
  echo "Database not ready yet, waiting... (attempt $i/30)"
  sleep 2
  i=$((i + 1))
done

if ! nc -z auth-database 5432; then
  echo "ERROR: Database is not available after 60 seconds"
  exit 1
fi

echo "Waiting for RabbitMQ..."
while ! nc -z rabbitmq 5672; do
  sleep 1
done
echo "RabbitMQ started"

echo "Creating logs directory..."
mkdir -p logs
mkdir -p core/logs

echo "Creating migrations..."
python manage.py makemigrations --no-input

echo "Running database migrations..."
python manage.py migrate --no-input

echo "Loading fixtures..."
python manage.py loaddata */fixtures/*.json || echo "No fixtures found or already loaded"

echo "Cleaning up old files..."
rm -f celerybeat.pid
rm -f logs/debug.log

echo "Collecting static files..."
python manage.py collectstatic --noinput

echo "Starting application..."
exec "$@"
