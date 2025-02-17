# Build stage
FROM node:14 as build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

ARG NODE_ENV
ENV NODE_ENV=$NODE_ENV

RUN if [ "$NODE_ENV" = "production" ]; then npm run build; fi

# Development or Production stage
FROM node:14

WORKDIR /app

COPY --from=build /app .

EXPOSE 3000

CMD ["npm", "start"]