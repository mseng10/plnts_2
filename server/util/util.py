import sys
from colorama import init, Fore


class Util:
    @staticmethod
    def confirm(message: str) -> bool:
        "Get confirmation from the user."
        val = input(f"{message} y/n? ")
        return val == "y" or val == "yes"

    @staticmethod
    def input(message: str) -> str:
        result: str = input(message)
        if result == "QUIT":
            Util.system_exit()
        return result

    @staticmethod
    def system_exit():
        print("")
        print(Fore.GREEN + "GOODBYE:)")
        sys.exit()
