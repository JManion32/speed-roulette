FROM node:22 AS builder

WORKDIR /app
COPY package.json ./
RUN npm install
COPY . ./
RUN npm run build
