from dotenv import load_dotenv
import os

load_dotenv()

from password_merge import encrypt, decrypt
import password_global
import database
import bottle

from server_auth import server_auth, generate_token
from server_messages import error, success


@bottle.route("/")
@bottle.view("login.html")
def home():
    return


@bottle.route("/~")
@bottle.view("index.html")
def dashboard():
    if server_auth(bottle):
        return {"passwords": database.get_passwords()}

    return bottle.redirect("/")


@bottle.post("/api/login")
def login():
    password = bottle.request.forms.get("password")
    if password_global.compare_password(password):
        token = generate_token()
        bottle.response.set_cookie(
            "token", token, path="/", httponly=True, secret=os.getenv("COOKIE_SECRET")
        )
        return {**success("Created token"), "token": token}
    return error("Incorrect password")


@bottle.get("/api/getPassword/<id>")
def get_password(id):
    if not server_auth(bottle):
        return error("Not authenticated")

    password = decrypt(database.get_password(id)[0])
    return {**success("Fetched password"), "password": password}


@bottle.post("/api/addPassword")
def add_password():
    if not server_auth(bottle):
        return error("Not authenticated")

    try:
        body = bottle.request.json
        database.add_password(
            body.get("url"), body.get("username"), encrypt(body.get("password"))
        )
        return success("Added password")
    except:
        return error("Failed to add password")


@bottle.put("/api/updatePassword/<id>")
def update_password(id):
    if not server_auth(bottle):
        return error("Not authenticated")

    try:
        body = bottle.request.json
        database.update_password(
            id, body.get("url"), body.get("username"), encrypt(body.get("password"))
        )
        return success("Updated password")
    except:
        return error("Failed to update password")


@bottle.delete("/api/deletePassword/<id>")
def delete_password(id):
    if not server_auth(bottle):
        return error("Not authenticated")

    database.remove_password(id)
    return success("Removed password")


@bottle.get("/api/passwords")
def serve_passwords():
    bottle.response.content_type = "application/json"
    return {**success("Retrieved passwords"), "passwords": database.get_passwords()}


# serve static files
@bottle.route("/<path:path>")
def serve_static(path):
    return bottle.static_file(path, root="./static")


bottle.run(host="0.0.0.0", port=5500)
