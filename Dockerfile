FROM python:3.11-slim
WORKDIR /app
COPY . .
EXPOSE 8899
CMD ["python3", "server.py"]
