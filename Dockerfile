FROM python:3.11-slim

WORKDIR /app

# Install system deps
RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements
COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY start.sh /app/start.sh
RUN chmod +x /app/start.sh

# Copy project
COPY . .

# Expose port
EXPOSE 8000

# Run app
CMD ["./start.sh"]