FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production=false
COPY . .
EXPOSE 5000
CMD ["node", "backend/server.js"]
