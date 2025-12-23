FROM node:20-slim

WORKDIR /app

COPY package*.json ./
RUN npm install

# 確保安裝 cookie-parser
RUN npm install cookie-parser @types/cookie-parser

EXPOSE 3000

CMD ["npm", "run", "start:dev"]
