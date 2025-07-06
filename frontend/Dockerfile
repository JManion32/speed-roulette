ARG BUILD_MODE

# Stage 1: Build Vite app
FROM node:22 AS builder

WORKDIR /app
COPY package.json ./
RUN npm install
COPY . ./
RUN npm run build

# Stage 2: Dev or Prod switch
FROM node:22 AS devserver
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . ./
EXPOSE 5173
CMD ["npm", "run", "dev"]

# Stage 3: NGINX for prod
FROM nginx:alpine AS nginxserver

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

# Final stage
FROM ${BUILD_MODE:-devserver} AS final
