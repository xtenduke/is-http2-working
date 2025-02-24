# Dockerfile

FROM joseluisq/static-web-server:latest

# Set working directory
WORKDIR /app

# Copy static files into the container
COPY index.html /app/

# Expose port 80
EXPOSE 80

# Command to run the server
CMD ["--port", "80", "--root", "/app"]
