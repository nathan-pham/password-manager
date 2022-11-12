from dotenv import load_dotenv
import os

load_dotenv()

from cryptography.fernet import Fernet
from password_merge import get_key
import password_global
import database
import bottle

from middleware_auth import middleware_auth, generate_token

@bottle.route("/")
@bottle.view("login.html")
def home():
    return

@bottle.route("/~")
@bottle.view("index.html")
def dashboard():
    if middleware_auth(bottle):
        return {
            "passwords": database.get_passwords()
        }

    return bottle.redirect("/")    

@bottle.post("/api/login")
def login():
    password = bottle.request.forms.get("password")
    if password_global.compare_password(password):
        token = generate_token()
        bottle.response.set_cookie("token", token, path="/", httponly=True, secret=os.getenv("COOKIE_SECRET"))
        return {
            "success": True,
            "token": token
        }

    return {
        "success": False,
        "message": "Incorrect password"
    }

@bottle.get("/api/getPassword/<id>")
def get_password(id):
    if middleware_auth(bottle):
        f = Fernet(get_key())
        return {
            "success": True,
            "password": f.decrypt(database.get_password(id)[0].encode("utf-8")).decode("utf-8")
        }

    return {
        "success": False,
        "message": "Not authenticated"
    }

@bottle.post("/api/addPassword")
def add_password():
    body = bottle.request.json
    try:
        database.add_password(body.get("url"), body.get("username"), body.get("password"))
        return {
            "success": True,
            "message": "Added password"
        }
    except:
        return {
            "success": False,
            "message": "Failed to add password"
        }

@bottle.put("/api/updatePassword/<id>")
def update_password():
    return {}

@bottle.delete("/api/deletePassword/<id>")
def delete_password():
    return {}

@bottle.get("/api/passwords")
def serve_passwords():
    bottle.response.content_type = "application/json" 
    return {
        "passwords": database.get_passwords()
    }

# serve static files
@bottle.route("/<path:path>")
def serve_static(path):
    return bottle.static_file(path, root="./static")

bottle.run(host="localhost", port=5500)