# Multi-stage Dockerfile

# ============================================
# Stage 1: Development (hot reload)
# ============================================
FROM node:25-alpine AS development

WORKDIR /app

# Copy package files (including lock file)
COPY package*.json ./

# WAŻNE: Skopiuj lokalny pakiet MDB PRZED npm ci
COPY src/mdb-local ./src/mdb-local

# Install dependencies using lock file (faster & deterministic)
RUN npm ci

# Copy source code
COPY . .

# Expose ports
EXPOSE 3000
EXPOSE 3443

# Start Vite dev server
# --host 0.0.0.0 = dostępny z zewnątrz kontenera
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "3000"]


# ============================================
# Stage 2: Build (production artifacts)
# ============================================
FROM node:25-alpine AS build

WORKDIR /app

COPY package*.json ./

# Skopiuj mdb-local również do stage build
COPY src/mdb-local ./src/mdb-local

RUN npm ci --only=production

COPY . .
RUN npm run build


# ============================================
# Stage 3: Production (Nginx serves static)
# ============================================
FROM nginx:alpine AS production

# Copy built files
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx config (opcjonalnie - jeśli chcesz custom)
# COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]