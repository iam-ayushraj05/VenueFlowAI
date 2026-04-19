# Stage 1: Build the React frontend
FROM node:18-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Setup the Express backend
FROM node:18-alpine
WORKDIR /app
COPY backend/package*.json ./backend/
RUN cd backend && npm install --production
COPY backend/ ./backend/
# Copy the built frontend static files
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

WORKDIR /app/backend
ENV NODE_ENV=production
# Cloud Run injects PORT environment variable (default 8080)
ENV PORT=8080

EXPOSE 8080
CMD ["node", "index.js"]
