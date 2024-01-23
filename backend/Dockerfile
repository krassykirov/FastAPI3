FROM tiangolo/uvicorn-gunicorn:python3.11-slim

COPY . /app
WORKDIR /app
RUN pip install -r requirements.txt
EXPOSE 8000
CMD uvicorn app:app --host 127.0.0.1
