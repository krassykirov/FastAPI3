FROM tiangolo/uvicorn-gunicorn:python3.11-slim

COPY . /app
WORKDIR /app
RUN pip install -r requirements.txt
EXPOSE 8000
CMD uvicorn src.app:app --host 0.0.0.0

