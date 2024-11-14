# Use the official Nginx image as the base image
FROM nginx:1.27.2-alpine3.20

# Remove the default Nginx configuration
RUN rm -rf /etc/nginx/conf.d/*

# Copy the custom Nginx configuration file to the container
COPY dockers/nginx/default.conf /etc/nginx/conf.d/default.conf

# Expose port 80 for Nginx
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
