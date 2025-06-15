import requests
from bs4 import BeautifulSoup
import json
import re
from collections import defaultdict

# Step 1: Download the live Warframe drop table
url = "https://www.warframe.com/droptables"
response = requests.get(url)
response.raise_for_status()
soup = BeautifulSoup(response.text, "html.parser")

relic_order = {'Lith': 0, 'Meso': 1, 'Neo': 2, 'Axi': 3}

def extract_relics_from_missions(soup):
    mission_rewards_section = soup.find('h3', id='missionRewards')

    if not mission_rewards_section:
        return []

    relics = []
    table = mission_rewards_section.find_next('table')
    if table:
        rows = table.find_all('tr')
        for row in rows:
            cells = row.find_all('td')
            if cells:
                item_name = cells[0].text.strip().replace(" (Radiant)", "")
                if "Relic" in item_name and item_name not in relics:
                    relics.append(item_name)

    return relics


def sort_key(relic):
    parts = relic.split()
    return (relic_order[parts[0]], parts[1][0], int(parts[1][1:]))

def extract_items_from_relics(soup, relics):
    relic_section = soup.find('h3', id='relicRewards')
    table = relic_section.find_next('table')

    nrelics = {}
    current_relic = None

    for row in table.find_all('tr'):
        if 'blank-row' in row.get('class', []):
            current_relic = None
        else:
            th = row.find('th')
            td = row.find('td')
            if th:
                current_relic = th.text.strip().replace(" (Intact)", "")
                if current_relic not in relics:
                    continue
                nrelics[current_relic] = []
            elif td and current_relic:
                if current_relic not in relics:
                    continue
                item = td.text.strip()
                if 'Forma' not in item:
                    nrelics[current_relic].append(item)


    sorted_nrelics = dict(sorted(nrelics.items(), key=lambda x: sort_key(x[0])))
    return sorted_nrelics

def extract_item_name(component):
    # Use regex to match the first two words (e.g., "Sevagoth Prime")
    match = re.match(r'^(\w+\s+\w+)', component)
    return match.group(1) if match else None

relics = extract_relics_from_missions(soup)
print(relics)

# Step 5: Save result
with open("available_relics.json", "w", encoding="utf-8") as f:
    json.dump(relics, f, indent=2)

items = extract_items_from_relics(soup, relics)
print(items)

# Step 5: Save result
with open("available_items.json", "w", encoding="utf-8") as f:
    json.dump(items, f, indent=4)

items_with_components = defaultdict(lambda: defaultdict(list))

with open('available_items.json', 'r') as relic_file:
    relic_data = json.load(relic_file)

for relic, components in relic_data.items():
    for component in components:
        # Extract the finished item name
        item_name = extract_item_name(component)
        if item_name:
            # Add the component and the relic to the dictionary
            items_with_components[item_name][component].append(relic)

# Convert defaultdict to a regular dictionary for JSON serialization
items_with_components = {item: dict(components) for item, components in items_with_components.items()}

# Save the generated data to a JSON file
output_path = 'itemsWithComponents.json'
with open(output_path, 'w') as output_file:
    json.dump(items_with_components, output_file, indent=4)




print(f"✅ Updated with {len(relics)} currently available relics.")
