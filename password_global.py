import bcrypt
import os

GLOBAL_PASSWORD_FILE = "passwords/global.txt"


def create_password(default_password=None):
    password = default_password or input("Global Password Manager Key > ")
    hashed = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())
    with open(GLOBAL_PASSWORD_FILE, "wb") as file:
        file.write(hashed)
        return hashed


def get_password():
    if not os.path.isfile(GLOBAL_PASSWORD_FILE):
        return create_password("admin")

    with open(GLOBAL_PASSWORD_FILE, "rb") as file:
        return file.read()


def compare_password(password):
    global_password = get_password()
    return bcrypt.checkpw(password.encode("utf-8"), global_password)


if __name__ == "__main__":
    create_password()
