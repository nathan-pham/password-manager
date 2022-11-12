from urllib.parse import urlparse
import sqlite3

con = sqlite3.connect("./database.db")
cur = con.cursor()

# create table
cur.execute("CREATE TABLE IF NOT EXISTS passwords (id INTEGER PRIMARY KEY AUTOINCREMENT, url TEXT, username TEXT, password TEXT)")

def add_password(url, username, password):
    cur.execute("INSERT INTO passwords(url, username, password) VALUES(?, ?, ?)", (url, username, password))
    con.commit()

def remove_password(id):
    cur.execute("DELETE FROM passwords WHERE id = ?", (id,))
    con.commit()

def get_password(id):
    cur.execute("SELECT password FROM passwords WHERE id = ?", (id,))
    return cur.fetchone()

def get_passwords():
    cur.execute("SELECT * FROM passwords")
    return cur.fetchall()

def get_formatted_passwords():
    passwords = get_passwords()
    editable_passwords = []
    for (key, url, username, password) in passwords:
        editable_passwords.append({
            "id": key,
            "url": url,
            "domain": urlparse(url).netloc,
            "username": username,
            "password": password
        })

    return editable_passwords