# Use the official Node.js image as the base image
FROM node:16 AS frontend-builder

# Set the working directory inside the container for the frontend
WORKDIR /app/frontend

# Copy the package.json and package-lock.json files to the container for frontend
COPY frontend/package.json frontend/package-lock.json ./

# Install frontend dependencies
RUN npm ci

# Copy the rest of the frontend's source code to the container
COPY frontend .

# Build the React Vite app
RUN npm run build

# Use a lightweight Nginx image to serve the production frontend build
FROM nginx:alpine AS frontend

# Remove the default Nginx configuration
RUN rm -rf /etc/nginx/conf.d/*

# Copy the custom Nginx configuration file to the container for frontend
COPY /docker/nginx/default.conf /etc/nginx/conf.d/default.conf

# Copy the built frontend from the frontend-builder stage to the Nginx web root
COPY --from=frontend-builder /app/frontend/dist /usr/share/nginx/html

# Expose the Nginx port for frontend
EXPOSE 80
