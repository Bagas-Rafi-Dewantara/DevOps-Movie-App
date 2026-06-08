# Gunakan Node.js 18 Alpine (lightweight)
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json dan package-lock.json
COPY package.json package-lock.json* ./

# Install dependencies (npm ci lebih cepat dan stabil untuk CI/CD)
# --omit=dev akan mengabaikan nodemon agar image lebih kecil
RUN npm ci --omit=dev

# Copy semua file server
COPY . .

# Azure App Service akan menyuntikkan environment variable PORT secara otomatis.
# Kita expose 8080 sebagai standar default Azure.
ENV PORT=8080
EXPOSE 8080

# Start server
# (server/index.js sudah menggunakan process.env.PORT || 3001, jadi ini aman)
CMD ["node", "index.js"]