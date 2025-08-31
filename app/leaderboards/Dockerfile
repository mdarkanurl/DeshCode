FROM node:alpine

WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy everything first
COPY . .

RUN pnpm install --frozen-lockfile
RUN pnpm run build

# Default command
CMD ["pnpm", "run", "start"]