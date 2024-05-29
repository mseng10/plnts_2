"""
Base model of the application. Meant to be inherited by all model types.
"""
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()
