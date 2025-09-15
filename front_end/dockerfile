# Build stage
FROM node:18.18.0-alpine AS builder
WORKDIR /src
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production stage
FROM node:18.18.0-alpine
WORKDIR /src
COPY --from=builder /src/next.config.ts ./next.config.ts
COPY --from=builder /src/public ./public
COPY --from=builder /src/.next ./.next
COPY --from=builder /src/node_modules ./node_modules
COPY --from=builder /src/package.json ./package.json

CMD ["npm", "start"]
