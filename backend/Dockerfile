FROM tiangolo/uvicorn-gunicorn:python3.11-slim

COPY . /app
WORKDIR /app
RUN pip install -r requirements.txt
CMD ["python", "-m", "uvicorn", "app:app", "--host", "0.0.0.0", "--port", "80"]
