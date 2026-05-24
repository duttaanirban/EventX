FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
COPY server/package.json ./server/package.json
RUN npm ci --omit=dev --workspace eventx-server
COPY server ./server
WORKDIR /app/server
EXPOSE 5000
CMD ["npm", "start"]
