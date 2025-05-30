#!/bin/bash

set -e

echo "Starting SportBoard Auth Service..."

# Wait for database to be ready
echo "Waiting for database..."
while ! nc -z db 5432; do
  sleep 0.1
done
echo "Database started"

# Wait for Redis to be ready
echo "Waiting for Redis..."
while ! nc -z redis 6379; do
  sleep 0.1
done
echo "Redis started"

# Wait for RabbitMQ to be ready
echo "Waiting for RabbitMQ..."
while ! nc -z rabbitmq 5672; do
  sleep 0.1
done
echo "RabbitMQ started"

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
if [ "$ENVIRONMENT" = "production" ]; then
    echo "Creating superuser if needed..."
    python manage.py shell << EOF
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(email='admin@sportboard.com').exists():
    User.objects.create_superuser(
        email='admin@sportboard.com',
        password='admin123',
        first_name='Admin',
        last_name='User'
    )
    print('Superuser created successfully')
else:
    print('Superuser already exists')
EOF
fi

# Collect static files
echo "Collecting static files..."
python manage.py collectstatic --noinput

echo "Starting application..."
exec "$@"
