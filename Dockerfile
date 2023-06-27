# Define the build stage
FROM node:20.3-alpine AS builder

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Copy app source
COPY . .

# Disable Next.js telemetry
ENV NEXT_TELEMETRY_DISABLED 1

# Build the Next.js application
RUN npm run build

# Define the run stage
FROM node:20.3-alpine AS runner

# Set the working directory
WORKDIR /

# Install production dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy built assets from the build stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Your app runs on port 3000
EXPOSE 3000

# Command to start the app
CMD [ "npm", "start" ]
