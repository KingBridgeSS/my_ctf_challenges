# syntax=docker/dockerfile:1

FROM node:12.18.1
ENV NODE_ENV=production
WORKDIR /app
COPY . .
expose 3000
run chmod +x ./start.sh
ENTRYPOINT ./start.sh
