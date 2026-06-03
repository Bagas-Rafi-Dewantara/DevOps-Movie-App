# --- STAGE 1: BUILD ---
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package.json dan lock file (agar caching npm install lebih efisien)
COPY package.json package-lock.json* ./
RUN npm ci

# Copy seluruh source code
COPY . .

# Build aplikasi Next.js
RUN npm run build

# STAGE 2:PRODUCTION RUNNER
FROM node:18-alpine AS runner

WORKDIR /app

# Set environment ke production
ENV NODE_ENV production

# Buat user non-root demi keamanan (best practice)
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy file yang sudah di-build dari stage builder
# Next.js standalone output membuat folder .next/standalone yang berisi server.js dan dependencies yang diperlukan
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs

# Expose port 3000 (default Next.js)
EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Jalankan server Next.js standalone
CMD ["node", "server.js"]