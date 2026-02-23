# Base image
FROM node:20-bookworm-slim AS builder

WORKDIR /app

# Install OpenSSL for Prisma
# Chromium is removed here because builder only builds the app and doesn't need to run Puppeteer
RUN apt-get update && apt-get install -y openssl \
    && rm -rf /var/lib/apt/lists/*

# Skip downloading Chromium during build explicitly
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm ci

# Generate Prisma client
RUN npx prisma generate

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Prune dev dependencies so they don't get copied to production
RUN npm prune --omit=dev

# ---
# Production Image
FROM node:20-bookworm-slim

WORKDIR /app

# Install OpenSSL for Prisma and Chromium dependencies for Puppeteer
RUN apt-get update && apt-get install -y openssl \
    libnss3 \
    libnspr4 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libdrm2 \
    libxkbcommon0 \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \
    libxrandr2 \
    libgbm1 \
    libasound2 \
    chromium \
    && rm -rf /var/lib/apt/lists/*

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
ENV NODE_ENV=production

# Create non-root user for security (and create home directory with -m for Puppeteer caches)
RUN groupadd -r appgroup && useradd -m -r -g appgroup appuser

# Copy built files and pruned dependencies directly with their corresponding user rights
COPY --chown=appuser:appgroup --from=builder /app/package*.json ./
COPY --chown=appuser:appgroup --from=builder /app/node_modules ./node_modules
COPY --chown=appuser:appgroup --from=builder /app/prisma ./prisma
COPY --chown=appuser:appgroup --from=builder /app/dist ./dist

USER appuser

EXPOSE 8080

CMD ["node", "dist/main"]
