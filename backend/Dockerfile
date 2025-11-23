FROM python:3.13-alpine

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем зависимости
COPY requirements.txt ./

# Устанавливаем зависимости
RUN pip install --no-cache-dir -r requirements.txt

# Копируем весь бэк
COPY . .

# Команда по умолчанию - собираем статику, миграции, создаём админа, запускаем сервер
CMD ["sh", "-c", "python manage.py collectstatic --noinput && python create_admin.py && python manage.py migrate && python manage.py runserver 0.0.0.0:8000"]