FROM node:alpine

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
EXPOSE 3001

# Default command (can be overridden)
CMD ["pnpm", "run", "start:api"]