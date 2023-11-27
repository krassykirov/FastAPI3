import logging

logger = logging.getLogger(__name__)
# Create handlers
LOGFILE = 'Log.txt'
c_handler = logging.StreamHandler()
f_handler = logging.FileHandler(LOGFILE)
LOGLEVEL = logging.INFO

# Create formatters and add it to handlers
formatter = logging.Formatter(
    '[%(asctime)s %(levelname)s %(module)s - %(funcName)s:%(lineno)s]: %(message)s')
c_handler.setFormatter(formatter)
f_handler.setFormatter(formatter)

# Add handlers to the logger
logging.basicConfig(handlers=[c_handler, f_handler], level=LOGLEVEL)


def detailed_logger() -> logging.Logger:
    return logger