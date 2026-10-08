import urllib.request

try:
    with urllib.request.urlopen("https://loca.lt/mytunnelpassword") as response:
        print("LOCALTUNNEL PASSWORD IP:", response.read().decode().strip())
except Exception as e:
    print("Error fetching password:", e)
