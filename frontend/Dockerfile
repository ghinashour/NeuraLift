# ==========================
# Stage 1: Build Backend
# ==========================
FROM node:20-alpine AS backend-builder

WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm ci --only=production
COPY backend/ ./

# ==========================
# Stage 2: Build Frontend
# ==========================
FROM node:20-alpine AS frontend-builder

WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# ==========================
# Stage 3: Final Image
# ==========================
FROM node:20-alpine

WORKDIR /app

# Copy backend node_modules
COPY --from=backend-builder /app/backend/node_modules ./backend/node_modules

# Copy backend source
COPY --from=backend-builder /app/backend ./backend

# Copy frontend build
COPY --from=frontend-builder /app/frontend/build ./frontend/build

# Expose port
EXPOSE 4000

# Start backend server
WORKDIR /app/backend
CMD ["node", "server.js"]
