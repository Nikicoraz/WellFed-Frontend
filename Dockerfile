FROM node:22-alpine AS builder

WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
ARG VITE_BACKEND_URL
ARG VITE_BACKEND_URL_API
ARG VITE_GOOGLE_CLIENT_ID
RUN VITE_BACKEND_URL=$VITE_BACKEND_URL VITE_BACKEND_URL_API=$VITE_BACKEND_URL_API VITE_GOOGLE_CLIENT_ID=$VITE_GOOGLE_CLIENT_ID npx vite build

FROM nginx:alpine

COPY --from=builder /app/dist/ /usr/share/nginx/html/

RUN rm /etc/nginx/conf.d/default.conf && \
    printf '%s\n' \
    'server {' \
    '  listen 80;' \
    '  server_name _;' \
    '  root /usr/share/nginx/html;' \
    '  index index.html;' \
    '  location / {' \
    '    try_files $uri $uri/ /index.html;' \
    '  }' \
    '}' \
    > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
