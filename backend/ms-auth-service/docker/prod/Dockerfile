# Pull official base image 
FROM python:3.10-slim

# Set working directory
WORKDIR /app

# Set env variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

RUN apt-get update \
    && apt-get install -y gcc python3-dev musl-dev libmagic1 libffi-dev netcat-openbsd libzmq3-dev git

COPY ./app/requirements ./requirements

# Install dependencies
COPY ./app/requirements ./requirements
RUN pip install --upgrade pip
RUN pip install -r ./requirements/prod.txt

# Copy entrypoint.sh
COPY ./docker/prod/entrypoint.sh ./entrypoint.sh

# Convert line endings and set permissions
RUN sed -i 's/\r$//' ./entrypoint.sh && chmod +x ./entrypoint.sh

COPY ./app /app

# Expose port 8011
EXPOSE 8011

# Default command to run the entrypoint and then the server
CMD ["/bin/sh", "/app/entrypoint.sh", "gunicorn", "--bind", "0.0.0.0:8011", "--workers", "3", "core.wsgi:application"]
