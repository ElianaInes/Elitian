FROM python:3.11-slim

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq-dev gcc && \
    rm -rf /var/lib/apt/lists/*

COPY utils/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt gunicorn

COPY . .

RUN mkdir -p logs staticfiles media

RUN python manage.py collectstatic --noinput

EXPOSE 8000

CMD ["gunicorn", "Elitian.wsgi:application", "--bind", "0.0.0.0:8000", "--workers", "3", "--timeout", "60"]
