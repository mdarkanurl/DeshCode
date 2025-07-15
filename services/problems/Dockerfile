# Use official Node.js image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Expose port (if running API)
EXPOSE 3000

# Default command (can be overridden)
CMD ["npm", "start"]
