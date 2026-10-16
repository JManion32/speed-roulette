FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./
# Skip install scripts during ci (esbuild's can hit ETXTBSY racing parallel extraction,
# and the Cypress binary isn't needed in the image), then run only the ones the build needs
RUN npm ci --ignore-scripts && npm rebuild esbuild @swc/core

COPY . .

RUN npm run build

FROM nginx:stable-alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]