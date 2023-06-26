# Stage 1: Build the Next.js frontend
FROM node:14-alpine as frontend

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Build the Koa server backend
FROM node:14-alpine as backend
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --production
COPY server.js ./

# Stage 3: Create the final image
FROM node:14-alpine
WORKDIR /app

# Copy the built frontend files from the "frontend" stage
COPY --from=frontend /app/.next ./.next

# Copy the built backend files from the "backend" stage
COPY --from=backend /app .

# Expose the desired port (adjust if necessary)
EXPOSE 3000

# Start the Koa server
CMD ["node", "server.js"]
