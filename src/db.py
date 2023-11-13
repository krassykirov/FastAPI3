from sqlmodel import create_engine, Session
import os
# connection = os.getenv("conn_str", ""postgresql://fastapi_traefik:fastapi_traefik@db:5432/fastapi_traefik"")
SQLALCHEMY_DATABASE_URL = os.getenv('SQLALCHEMY_DATABASE_URL')
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})


def get_session():
    with Session(engine) as session:
        yield session

