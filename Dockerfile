# Use official Node.js 18 image
FROM node:18

# Create app directory
WORKDIR /usr/src/app

# Copy backend package.json and package-lock.json if exists
COPY backend/package.json backend/package-lock.json* ./backend/

# Install backend dependencies
RUN cd backend && npm install --production

# Copy backend source code
COPY backend ./backend

# Expose port from environment variable or default 5000
ENV PORT=5000
EXPOSE 5000

# Set working directory to backend
WORKDIR /usr/src/app/backend

# Start the backend server
CMD ["node", "server.js"]
