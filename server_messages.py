def error(message):
    return {
        "success": False,
        "message": message
    }

def success(message):
    return {
        "success": True,
        "message": message
    }