import shutil
from functools import wraps
from sqlalchemy.orm import Session
from my_logger import detailed_logger
import base64 

logger = detailed_logger()

def wrap(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        f = func.__name__
        write_log(f"function: {f} has been invoked")
        print('function_name:',f)
        return func(*args, **kwargs)
    return wrapper

def write_log(message=""):
    with open("log.txt", mode="a") as log_file:
        content = f"Log message: {message}"+ '\n'
        log_file.write(content)

def discounted_price(price, discount):
        if discount:
            discounted_price = round(price - price * discount, 2)
        else:
            discounted_price = round(price, 2)
        return discounted_price

def delete_item_dir(path):
    try:
        shutil.rmtree(path)
        logger.info(f"Done deleting item directory: {path}")
    except OSError as e:
        logger.error(f"Error deleting the directory: {path}, {e}")
    except Exception as e:
        logger.error(f"Something went wrong, error: {e}")
    return True


def encode_image_to_base64(image_path):
    with open(image_path, 'rb') as file:
        content = file.read()
        return base64.b64encode(content).decode("utf-8")

default_avatar_path = 'static/img/img_avatar.png'
default_avatar_base64 = encode_image_to_base64(default_avatar_path)
