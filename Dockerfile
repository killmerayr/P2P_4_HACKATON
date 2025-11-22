FROM node:20-alpine

WORKDIR /app

# Копируем ВСЕ файлы для сборки
COPY package*.json ./
COPY . .

# Устанавливаем ВСЕ зависимости (включая dev)
RUN npm ci

# Собираем с выводом ошибок
RUN npm run build

# Устанавливаем serve
RUN npm install -g serve

EXPOSE 3000

CMD ["serve", "-s", "dist", "-l", "3000"]