# Sử dụng Node.js 18 làm base image
FROM node:18

# Thiết lập thư mục làm việc trong container
WORKDIR /app

# Copy package.json và package-lock.json vào container
COPY package*.json ./

# Cài đặt dependencies
RUN npm install

# Copy toàn bộ mã nguồn vào container
COPY . .

# Biên dịch TypeScript sang JavaScript
RUN npx tsc

# Expose cổng chạy ứng dụng
EXPOSE 3000

# Chạy ứng dụng
CMD ["node", "dist/server.js"]
