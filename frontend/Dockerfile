# Use Node.js official image
FROM node:20

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY frontend/package*.json ./

# Install frontend dependencies
RUN npm install

# Copy the frontend files
COPY frontend .

# Expose port for frontend
EXPOSE 3001

# Command to run the frontend
CMD ["npm", "start"]
