import sys
from colorama import init, Fore


class Util:
    @staticmethod
    def confirm(message: str) -> bool:
        "Get confirmation from the user."
        val = input(f"{message} y/n? ")
        return val == "y" or val == "yes"

    @staticmethod
    def system_exit():
        print("")
        print(Fore.GREEN + "GOODBYE:)")
        sys.exit()
