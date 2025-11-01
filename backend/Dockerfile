FROM python:3.13-slim

WORKDIR /app

COPY requirements.txt ./requirements.txt
RUN pip install --upgrade pip && pip install -r requirements.txt

# Default command: run ASGI server (supports WebSockets via Channels)
CMD ["daphne", "-b", "0.0.0.0", "-p", "8000", "BGProject.asgi:application"]