import urllib.request
import json

try:
    with urllib.request.urlopen("http://127.0.0.1:8000/api/health") as response:
        data = json.loads(response.read().decode())
        print("API HEALTH RESPONSE:", data)
except Exception as e:
    print("API TEST ERROR:", e)
