import password_global
import database
import bottle

from datetime import datetime, timedelta, timezone
import secrets
import jwt

JWT_SECRET = secrets.token_hex()
JWT_ID = secrets.token_hex()

@bottle.route("/")
@bottle.view("login.html")
def home():
    token = bottle.request.get_cookie("token")
    
    return {}

@bottle.route("/~")
@bottle.view("index.html")
def dashboard():
    token = bottle.request.get_cookie("token")
    return {
        "passwords": database.get_formatted_passwords()
    }

@bottle.route("/<path:path>")
def serve_static(path):
    return bottle.static_file(path, root="./static")

@bottle.post()
@bottle.route("/api/login")
def login():
    password = bottle.request.forms.get("password")
    if password_global.compare_password(password):
        payload = { 
            "random_id": JWT_ID, 
            "exp": datetime.now(tz=timezone.utc) + timedelta(hours=1)
        }

        token = jwt.encode(payload=payload, key=JWT_SECRET)
        bottle.response.set_cookie("token", token)
        bottle.redirect("/~")
    else:
        bottle.redirect("/")

@bottle.post()
@bottle.route("/api/addPassword")
def add_password():
    return {}

@bottle.put()
@bottle.route("/api/updatePassword")
def update_password():
    return {}

@bottle.delete()
@bottle.route("/api/deletePassword")
def delete_password():
    return {}

@bottle.get()
@bottle.route("/api/passwords")
def serve_passwords():
    bottle.response.content_type = "application/json" 
    return {
        "passwords": database.get_passwords()
    }

bottle.run(host="localhost", port=5500)