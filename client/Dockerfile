FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
COPY client/package.json ./client/package.json
RUN npm ci --workspace eventx-client
COPY client ./client
WORKDIR /app/client
ARG VITE_API_URL=http://localhost:5000/api
ARG VITE_SOCKET_URL=http://localhost:5000
ARG VITE_RAZORPAY_KEY_ID=rzp_test_xxxxx
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_SOCKET_URL=$VITE_SOCKET_URL
ENV VITE_RAZORPAY_KEY_ID=$VITE_RAZORPAY_KEY_ID
RUN npm run build

FROM node:20-alpine
WORKDIR /app
RUN npm install -g serve
COPY --from=build /app/client/dist ./dist
EXPOSE 4173
CMD ["serve", "-s", "dist", "-l", "4173"]
