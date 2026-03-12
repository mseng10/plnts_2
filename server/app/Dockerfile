FROM python:3.12-slim
 
WORKDIR /app
 
# Copy and install requirements
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
 
# Copy application code
COPY . .
 
# Set permissions
RUN chmod -R 755 /app
 
# Copy and set up entrypoint
COPY app/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
 
EXPOSE 5000
 
ENTRYPOINT ["/entrypoint.sh"]
 