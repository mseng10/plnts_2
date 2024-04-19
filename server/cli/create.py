from models.plant import Plant
from util.util import Util
from datetime import datetime
from app import app, Session


@app.cli.command("create")
def create_plant() -> None:
    db = Session()

    query = db.query(Plant)
    plants: list[Plant] = query.all()
    print("Current Geni (lol):")
    for p in query.all():
        print(f"\t{p.genus}")
    genus: str = Util.input("Genus? ")

    print("Current Types in Geni (lol):")
    for p in plants:
        if genus == p.genus:
            print(f"\t{p.type}")
    type: str = Util.input("Type? ")

    print("Current Names in Type:")
    for p in plants:
        if genus == p.genus and type == p.type:
            print(f"\t{p.name}")
    name: str = Util.input("Name? ")

    watering: int = int(Util.input("Water how often (days)? "))
    cost: int = int(Util.input("Cost($)? "))

    watered_on_str: str = input("Last Water (MM-DD-YYYY)? ")
    if len(watered_on_str) == 0:
        watered_on = datetime.now()
    else:
        month, day, year = map(int, watered_on_str.split("-"))
        watered_on = datetime.date(year, month, day)

    plant = Plant(
        genus=genus,
        name=name,
        type=type,
        watering=watering,
        cost=cost,
        watered_on=watered_on,
    )
    print(plant)
    if not Util.confirm("Create? "):
        # TODO : Edit capability's?
        return

    db.add(plant)
    db.commit()
