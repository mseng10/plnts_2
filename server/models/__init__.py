from app import engine
from models.base import Base
from models.plant import Plant

# TODO: Implement way to make this configurable

Base.metadata.drop_all(engine)
Base.metadata.create_all(engine)
