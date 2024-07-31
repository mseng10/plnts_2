"""
This is the main source for anything db related.
"""

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, scoped_session
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.engine import URL

from models.plant import Plant, Genus, Type, Base
from models.system import System, Light
from models.alert import PlantAlert, Todo

import json

# Replace this with your actual database URL
with open("db.json", encoding="utf-8") as json_data_file:
    db_config = json.load(json_data_file)

# Create SQLAlchemy engine
url = URL.create(
    drivername=db_config["drivername"],
    username=db_config["username"],
    password=db_config["password"],
    host=db_config["host"],
    database=db_config["database"],
    port=db_config["port"],
)

# Create the SQLAlchemy engine
engine = create_engine(url)

# Create a configured "Session" class
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create a scoped session
Session = scoped_session(SessionLocal)

# Create a base class for declarative models
Base = declarative_base()

# This allows you to query the database directly using the Base class
Base.query = Session.query_property()

def get_db():
    """
    Generator function to create and yield a database session.
    Use this in FastAPI dependencies or Flask before_request handlers.
    """
    db = Session()
    try:
        yield db
    finally:
        db.close()

# Function to initialize the database (create tables)
def init_db():
    # Import all modules here that might define models so that
    # they will be registered properly on the metadata.
    import models  # Make sure to create this file with your SQLAlchemy models
    Base.metadata.create_all(bind=engine)