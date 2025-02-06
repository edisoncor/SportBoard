# Use a base Python image
FROM python:3.11

# Set the working directory in the container
WORKDIR /app

# Copy the requirements file to the container
COPY backend/users/requirements.txt /app/requirements.txt

# Install the dependencies
RUN pip install --no-cache-dir -r /app/requirements.txt

# Copy the rest of the application code to the container
COPY backend/users/ /app


# Expose the port the application will run on
EXPOSE 8004

# Define the default command to run the application
CMD ["gunicorn", "--bind", "0.0.0.0:8004", "users.wsgi:application"]