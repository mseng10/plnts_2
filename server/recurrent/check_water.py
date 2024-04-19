# from datetime import datetime, timedelta
# from cli.recurrent.recurrent import Recurrent
# from models.plant import Plant
# from db import Session
#
#
# class CheckWater(Recurrent):
#     def __init__(self) -> None:
#         Recurrent.__init__(
#             self,
#             key="check_water",
#             description="Checks and displays plants that need water.",
#             last_run=datetime.now(),
#             inc=1,  # every day
#         )
#
#     def process(self) -> None:
#         Recurrent.process(self)
#         db = Session()
#         db.query(Plant).filter(Plant.needs_water == False).filter(
#             Plant.watered_on + timedelta(days=Plant.watering) < datetime.now()
#         ).update({Plant.needs_water: True})
#         db.commit()
