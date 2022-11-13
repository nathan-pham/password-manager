from datetime import datetime, timedelta, timezone
from base64 import b64decode
import secrets
import jwt
import os


def server_auth(bottle):
    token = bottle.request.get_cookie("token", secret=os.getenv("COOKIE_SECRET"))

    # exit early, no token
    if not token:
        return False

    try:
        jwt.decode(token, os.getenv("JWT_SECRET"), algorithms=["HS256"])
        return True
    except Exception as e:
        return False


def generate_token():
    now = datetime.now(tz=timezone.utc)
    payload = {"iat": now, "exp": now + timedelta(hours=1)}

    return jwt.encode(payload, os.getenv("JWT_SECRET"), algorithm="HS256")
