# Build stage
FROM node:lts-alpine AS builder

USER node
WORKDIR /app

COPY package*.json .
RUN npm ci

COPY --chown=node:node . .
RUN npm run build

# Final run stage
FROM nginx:stable-alpine

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
