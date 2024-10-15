FROM python:3.9

WORKDIR /app

COPY ../requirements.txt .
RUN pip install -r requirements.txt

RUN apt-get update && apt-get install -y postgresql-client
COPY . .
COPY ../shared .

RUN chmod -R 755 /app

COPY app/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 5000

ENTRYPOINT ["/entrypoint.sh"]