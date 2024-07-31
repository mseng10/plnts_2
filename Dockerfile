version: '3.8'

server:
  backend:
    build: ./server
    ports:
      - "5000:5000"
    environment:
      - DATABASE_URL=postgresql://postgres:admin@db:5432/plnts
    depends_on:
      - db

  client:
    build: ./client
    ports:
      - "3000:3000"
    depends_on:
      - backend

  db:
    image: postgres:13
    volumes:
      - postgres_data:/var/lib/postgresql/data
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=admin
      - POSTGRES_DB=dbname

volumes:
  postgres_data: