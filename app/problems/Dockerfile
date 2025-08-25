# 1️⃣ Base image: Docker-in-Docker (DinD)
FROM docker:24.0-dind

# 2️⃣ Install Node.js and other tools
RUN apk add --no-cache \
    nodejs \
    npm

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install pnpm globally
RUN npm install -g pnpm

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy all source code
COPY . .

# Build TypeScript
RUN pnpm run prisma:generate
RUN pnpm run build

# Expose port for API and worker server
EXPOSE 3000
EXPOSE 4000

# Default command (can be overridden)
CMD ["pnpm", "run", "start:api"]