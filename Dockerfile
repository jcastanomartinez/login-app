# Paso 1: Compilar la aplicación
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build -- --configuration=production

# Paso 2: Servir con Nginx
FROM nginx:alpine
COPY --from=build /app/dist/login-app/browser /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
