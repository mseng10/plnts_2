"""
Utility module for miscellaneous functions.
"""

import sys
from colorama import Fore


class Util:
    """
    Utility class containing miscellaneous functions.
    """

    @staticmethod
    def confirm(message: str) -> bool:
        """
        Get confirmation from the user.

        Args:
            message (str): The message to display to the user.

        Returns:
            bool: True if the user confirms with 'y' or 'yes', False otherwise.
        """
        val = input(f"{message} y/n? ")
        return val in ("y", "yes")

    @staticmethod
    def system_exit():
        """
        Perform a system exit and print a goodbye message.
        """
        print("")
        print(Fore.GREEN + "GOODBYE:)")
        sys.exit()
