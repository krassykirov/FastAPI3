import shutil
from functools import wraps


def delete_item_dir(path):
    try:
        print(f"Deleting item directory: {path}")
        shutil.rmtree(path) # onerror={'error'}
    except OSError as e:
        print(f"Error deleting the directory: {path}, {e}")
    except Exception as e:
        print(f"Something went wrong, error: {e}")
    return True

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