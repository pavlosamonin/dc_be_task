# Use Node.js official image
FROM node:20

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Expose port for backend
EXPOSE 3000

# Command to run the backend
CMD ["npm", "run", "start:dev"]
