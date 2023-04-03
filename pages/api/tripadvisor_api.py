import requests

# Read API KEY from .env.local file in root folder
with open(".env.local", "r") as f:
    for line in f:
        if "TRIPADVISOR_KEY" in line:
            TRIPADVISOR_API_KEY = line.split("=")[1].strip()


search_query = "singapore"
url = f"https://api.content.tripadvisor.com/api/v1/location/search?key={TRIPADVISOR_API_KEY}&searchQuery={search_query}&language=en"

headers = {"accept": "application/json"}

response = requests.get(url, headers=headers)

print(response.text)
