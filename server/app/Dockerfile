FROM python:3.9
WORKDIR /app

COPY ../requirements.txt .
RUN pip install -r requirements.txt

# Remove PostgreSQL client and install MongoDB tools instead
RUN apt-get update && apt-get install -y \
    wget gnupg \
    && wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | apt-key add - \
    && echo "deb http://repo.mongodb.org/apt/debian bullseye/mongodb-org/7.0 main" | tee /etc/apt/sources.list.d/mongodb-org-7.0.list \
    && apt-get update \
    && apt-get install -y mongodb-mongosh mongodb-database-tools \
    && rm -rf /var/lib/apt/lists/*

COPY . .
COPY ../shared .
RUN chmod -R 755 /app

COPY app/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 5000
ENTRYPOINT ["/entrypoint.sh"]