from cryptography.fernet import Fernet
import bcrypt
import os

import database

PASSWORDS_KEY_FILE = "passwords/passwords.key"
PASSWORDS_FILE = "passwords/passwords.csv"

def generate_key():
    key = Fernet.generate_key()
    with open(PASSWORDS_KEY_FILE, "wb") as mykey:
        mykey.write(key)
        return key

def get_key():
    if not os.path.isfile(PASSWORDS_KEY_FILE):
        return generate_key()

    with open(PASSWORDS_KEY_FILE, "rb") as mykey:
        return mykey.read()

# csv file in this format (export from edge format)
# name, url, username, password

def merge_passwords():
    # generate key, if necessary
    f = Fernet(get_key())

    # read csv file
    with open(PASSWORDS_FILE) as file:
        # parse each line for domain, url, username, password
        [header, *content] = file.read().split('\n')
        content = [line.split(',') for line in content if len(line) > 0]
        for line in content:
            _, url, username, password = line
            encryped_password = f.encrypt(password.encode("utf-8"))
            database.add_password(url, username, encryped_password.decode("utf-8"))

def encrypt(password):
    f = Fernet(get_key())
    return f.encrypt(password.encode("utf-8"))

def decrypt(password):
    f = Fernet(get_key())
    return f.decrypt(password).decode("utf-8")

if __name__ == "__main__":
    merge_passwords()