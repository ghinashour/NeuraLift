# Use official Node.js LTS image
FROM node:20-alpine

# Set working directory inside container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of the backend files
COPY . .

# Expose the port your backend listens on
EXPOSE 5000

# Set environment variable for production
ENV NODE_ENV=production

# Start the backend server
CMD ["node", "index.js"]
