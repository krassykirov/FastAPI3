import shutil

def delete_item_dir(path):
    try:
        print(f"Deleting item directory: {path}")
        shutil.rmtree(path) # onerror={'error'}
    except OSError as e:
        print(f"Error deleting the directory: {path}, {e}")
    except Exception as e:
        print(f"Something went wrong, error: {e}")
    return True