FROM python:3.11-slim-bookworm

WORKDIR /app

COPY requirements.txt ./

# Instala dependencias del sistema necesarias para mysqlclient
RUN apt-get update && apt-get install -y gcc default-libmysqlclient-dev pkg-config build-essential

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8010

CMD ["python", "manage.py", "runserver", "0.0.0.0:8010"]