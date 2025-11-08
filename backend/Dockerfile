# backend/Dockerfile
# ======================================================
# Node.js backend for Neuralift MERN app
# ======================================================

# Use official Node.js LTS image
FROM node:20-alpine

# Set working directory inside container
WORKDIR /app

# Copy package.json and package-lock.json first
COPY package*.json ./

# Install runtime dependencies only (production)
RUN npm install --production

# Copy the rest of the backend files
COPY . .

# Expose the port your backend will run on
EXPOSE 4000

# Set environment variable for production
ENV NODE_ENV=production

# Start the server
CMD ["node", "index.js"]
