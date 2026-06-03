# Use Node.js 18
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm ci --production

# Copy all server files
COPY . .

# Expose port
EXPOSE 3001

# Start the server
CMD ["npm", "start"]