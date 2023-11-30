FROM tiangolo/uvicorn-gunicorn:python3.11-slim

COPY . .
RUN pip install -r requirements.txt
EXPOSE 8000
CMD uvicorn src.api:app --host 0.0.0.0
