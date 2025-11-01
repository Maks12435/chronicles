import requests
from bs4 import BeautifulSoup
import json

def parse_league_table(league: str):

    url = f"https://www.sports.ru/football/tournament/{league}/table/"
    resp = requests.get(url)
    if resp.status_code != 200:
        return {"error": f"Не удалось загрузить данные для лиги: {league}"}

    soup = BeautifulSoup(resp.text, "html.parser")

    column_names = ["number", "team", "tour", "won", "draw", "lose", "scored", "conceded", "points"]

    table_data = []
    for row in soup.select("table tbody tr"):
        cols = row.find_all(["td", "th"])
        if not cols:
            continue

        team_data = {}
        for i, col in enumerate(cols):
            key = column_names[i] if i < len(column_names) else f"col{i+1}"
            team_data[key] = col.get_text(strip=True)
        table_data.append(team_data)
        
    return table_data


