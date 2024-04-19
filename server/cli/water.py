from util.util import Util
from models.plant import Plant
from datetime import datetime
from app import app, Session


@app.cli.command("water")
def water_plant():
    db = Session()
    query = db.query(Plant).filter(Plant.needs_water == True)
    plants: list[Plant] = query.all()

    if len(plants) == 0:
        print("No plants need to be watered, yay.")
        Util.system_exit()

    print("Plants that need water:")
    for p in plants:
        print(p)

    if Util.confirm("All of them?"):
        query.update({Plant.needs_water: False, Plant.watered_on: datetime.now()})
        db.commit()
    elif Util.confirm("One by one?"):
        for p in plants:
            if Util.confirm(f"{p} water? "):
                p.needs_water = False
                p.watered_on = datetime.now()
        db.commit()
