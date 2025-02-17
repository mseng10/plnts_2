FROM python:3.9

# Install MongoDB client tools
RUN apt-get update && apt-get install -y gnupg curl
RUN curl -fsSL https://pgp.mongodb.com/server-6.0.asc | \
    gpg -o /usr/share/keyrings/mongodb-server-6.0.gpg \
    --dearmor
RUN echo "deb [ signed-by=/usr/share/keyrings/mongodb-server-6.0.gpg] http://repo.mongodb.org/apt/debian bullseye/mongodb-org/6.0 main" | \
    tee /etc/apt/sources.list.d/mongodb-org-6.0.list
RUN apt-get update && apt-get install -y mongodb-mongosh

WORKDIR /app
COPY ../requirements.txt .
RUN pip install -r requirements.txt
COPY . .
COPY ../shared .
RUN chmod -R 755 /app
COPY app/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
EXPOSE 5000
ENTRYPOINT ["/entrypoint.sh"]