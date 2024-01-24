from sqlmodel import create_engine, Session
import os
# connection = os.getenv("conn_str", ""postgresql://fastapi_traefik:fastapi_traefik@db:5432/fastapi_traefik"")
# engine = create_engine('postgresql://postgres:postgres@localhost:5432/postgres', echo=True)
# default_session = scoped_session(sessionmaker(autocommit=False,
#                                          autoflush=False,
#                                          bind=engine))
SQLALCHEMY_DATABASE_URL = os.getenv('SQLALCHEMY_DATABASE_URL','sqlite:///backend.db')
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})


def get_session():
    with Session(engine) as session:
        yield session

