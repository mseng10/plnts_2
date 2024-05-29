# from sqlalchemy import Column, Integer, String, DateTime
# from sqlalchemy.orm import relationship, Mapped
# from datetime import datetime
# from models import Base
# from typing import List


# class Mix(Base):
#     """Soil model."""

#     __tablename__ = "mix"

#     # TODO: Base Merge
#     id = Column(Integer(), primary_key=True)
#     name = Column(String(100), nullable=False)
#     created_on = Column(DateTime(), default=datetime.now)

#     components: Mapped[List["Soil"]] = relationship()  # 1 way
#     details = Column(String(100), nullable=False)

#     def __repr__(self) -> str:
#         return f"{self.name}"


# class Soil(Base):
#     """Soil."""

#     __tablename__ = "soil"

#     # TODO: Base Merge
#     # Created at stuff
#     id = Column(Integer(), primary_key=True)
#     name = Column(String(100), nullable=False)
#     created_on = Column(DateTime(), default=datetime.now)
#     cost = Column(Integer())
#     size = Column(Integer())  # kgs?

#     parent_id: Mapped[int] = mapped_column(ForeignKey("mix.id"))

#     def __repr__(self) -> str:
#         return f"{self.name}"
