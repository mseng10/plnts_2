from models.plant import Plant
from util.util import Util
from datetime import datetime
from app import app, Session


@app.cli.command("archive")
def archive_plant() -> None:
    db = Session()
    filtered_plants: list[Plant] = db.query(Plant).all()
    if len(filtered_plants) == 0:
        print("No plants need to be archived, weird.")
        Util.system_exit()

    print("Current Geni (lol):")
    for p in filtered_plants:
        print(f"\t{p.genus}")
    genus: str = Util.input("Genus? ")
    filtered_plants = [p for p in filtered_plants if p.genus == genus]

    print("Current Types in Geni (lol):")
    for p in filtered_plants:
        print(f"\t{p.type}")
    type: str = Util.input("Type? ")
    filtered_plants = [p for p in filtered_plants if p.type == type]

    print("Current Names in Type:")
    for p in filtered_plants:
        print(f"\t{p.name}")
    name: str = Util.input("Name? ")
    filtered_plants = [p for p in filtered_plants if p.name == name]

    print("Which one?")
    for p in filtered_plants:
        print(f"\t{p.id}")
    id: int = int(
        Util.input("ID? ")
    )  # TODO: Make better once we have multiple of same type
    filtered_plants = [p for p in filtered_plants if p.id == id]

    plant = filtered_plants[0]
    print("--------------------")
    print(f"{plant} to archive.")
    while Util.confirm("Continue to update field on plant"):
        plant.alive = False
        plant.dead_on = datetime.now()
        plant.cause = Util.input("Cause of death? ")
        db.commit()
        print("Plant is is archived..")
        print()
