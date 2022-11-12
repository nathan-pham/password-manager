import bcrypt

GLOBAL_PASSWORD_FILE = "passwords/global.txt"

def create_password():
    password = input("Global Password Manager Key > ").encode("utf-8")
    hashed = bcrypt.hashpw(password, bcrypt.gensalt())
    with open(GLOBAL_PASSWORD_FILE, "wb") as file:
        file.write(hashed)

def compare_password(password):
    with open(GLOBAL_PASSWORD_FILE, "rb") as file:
        global_password = file.read()
        return bcrypt.checkpw(password.encode("utf-8"), global_password)

if __name__ == "__main__":
    create_password()