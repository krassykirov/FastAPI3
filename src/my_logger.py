import logging

logger = logging.getLogger(__name__)
# Create handlers
c_handler = logging.StreamHandler()
c_handler.setLevel(logging.INFO)
LOGLEVEL = logging.INFO
LOGFILE = 'Log.txt'

# Create formatters and add it to handlers
formatter = logging.Formatter(
    '[%(asctime)s %(levelname)s %(module)s - %(funcName)s:%(lineno)s]: %(message)s')
c_handler.setFormatter(formatter)

# Add handlers to the logger
logging.basicConfig(handlers=[c_handler], level=LOGLEVEL)


def detailed_logger() -> logging.Logger:
    "prepare logger"
    return logger