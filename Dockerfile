# MAX Task Manager - Optimized Multi-Stage Dockerfile
# Next.js 16 + Prisma 6.x + PostgreSQL

# =============================================================================
# Stage 1: Dependencies
# =============================================================================
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps --no-optional && \
    npm cache clean --force

# =============================================================================
# Stage 2: Builder
# =============================================================================
FROM node:20-alpine AS builder
WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy source code
COPY . .

# Build arguments for database URL
ARG DATABASE_URL
ENV DATABASE_URL ${DATABASE_URL}

ENV NEXT_TELEMETRY_DISABLED=1

# Install Prisma CLI locally for build
RUN npm install --save-dev prisma@6 --legacy-peer-deps

# Generate Prisma Client (with proper permissions)
RUN npx --yes prisma@6 generate

# Build Next.js application
RUN npm run build

# =============================================================================
# Stage 3: Runner
# =============================================================================
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Install Prisma CLI globally (version 6.x to match project)
RUN npm install -g prisma@6 @prisma/client@6 --legacy-peer-deps && \
    npm cache clean --force

# Copy necessary files from builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/docker-entrypoint.js ./docker-entrypoint.js

# Set proper permissions
RUN chmod +x docker-entrypoint.js

# Switch to non-root user
USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Run the entrypoint script
CMD ["node", "docker-entrypoint.js"]
