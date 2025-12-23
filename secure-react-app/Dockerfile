FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

# 確保安裝 Tailwind CSS v4 的 PostCSS 插件
RUN npm install @tailwindcss/postcss

COPY . .

EXPOSE 5174

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

