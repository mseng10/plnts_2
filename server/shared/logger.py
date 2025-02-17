import logging
import sys


def setup_logger(name=__name__, level=logging.INFO):
    """
    Set up and configure a logger.

    Args:
    name (str): The name of the logger. Defaults to the module name.
    level (int): The logging level. Defaults to logging.INFO.

    Returns:
    logging.Logger: A configured logger instance.
    """
    # Custom logger
    logger = logging.getLogger(name)

    # Set the logging level
    logger.setLevel(level)

    # Create handlers
    c_handler = logging.StreamHandler(sys.stdout)
    f_handler = logging.FileHandler(f"{__name__}.log")
    c_handler.setLevel(level)
    f_handler.setLevel(level)

    # Create formatters and add it to handlers
    log_format = logging.Formatter(
        "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
    )
    c_handler.setFormatter(log_format)
    f_handler.setFormatter(log_format)

    # Add handlers to the logger
    logger.addHandler(c_handler)
    logger.addHandler(f_handler)

    return logger


# Default logger
logger = setup_logger()
