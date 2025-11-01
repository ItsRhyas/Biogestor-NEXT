# Etapa 1: build de la app
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json ./
COPY package-lock.json ./
RUN npm ci

# Instala tipos para Jest y Testing Library
RUN npm install --save-dev @types/jest @types/testing-library__react

COPY . .
RUN npm run build

# # Etapa 2: servir la app
# FROM nginx:alpine
# WORKDIR /usr/share/nginx/html
# COPY --from=builder /app/dist .
# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]

# build de produccion
FROM nginx:stable-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY --from=builder /app/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]