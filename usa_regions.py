import glob
import yaml

# Region assignment for the 80 real USA-trip entries, done from each entry's
# actual recovered coordinates/city (design-brief.md's old "~14/18/18/25"
# tallies were rough guesses that don't even sum to 86, and were made before
# any of this data existed in structured form). Four regions per the
# confirmed USA hub spec: Eastern, Central, Southwest and Hawaii, Northwest.
#
# Rule of thumb applied:
# - Eastern: Northeast/Mid-Atlantic + Florida.
# - Central: Great Plains, Midwest, Great Lakes (incl. Michigan's Upper
#   Peninsula), and Texas/Gulf South.
# - Southwest and Hawaii: true low-desert Southwest (AZ, NM, S. CA, S. NV,
#   the OK panhandle) plus Hawaii.
# - Northwest: Pacific Northwest + the entire Rocky Mountain interior
#   (MT/ID/WY/CO/UT) + Northern California (SF Bay/Sierra) — grouping all
#   of the Mountain West together, consistent with the site's existing
#   note that Utah/Nevada/Wyoming border entries and SF/Yosemite belong
#   here rather than with the desert Southwest.

REGIONS = {
    # Eastern
    "northamerica-usa-washingtondc": "Eastern",
    "northamerica-usa-washingtondc2": "Eastern",
    "northamerica-usa-boston": "Eastern",
    "northamerica-usa-newport": "Eastern",
    "northamerica-usa-mystic": "Eastern",
    "northamerica-usa-hartford": "Eastern",
    "northamerica-usa-philadelphia": "Eastern",
    "northamerica-usa-clinton": "Eastern",
    "northamerica-usa-miami": "Eastern",

    # Central
    "northamerica-usa-neworleans": "Central",
    "northamerica-usa-memphis": "Central",
    "northamerica-usa-stlouis": "Central",
    "northamerica-usa-littlerock": "Central",
    "northamerica-usa-chicago2": "Central",
    "northamerica-usa-chicago3": "Central",
    "northamerica-usa-madison": "Central",
    "northamerica-usa-desmoines": "Central",
    "northamerica-usa-omaha": "Central",
    "northamerica-usa-westernnebraska": "Central",
    "northamerica-usa-cawkercity": "Central",
    "northamerica-usa-dallas": "Central",
    "northamerica-usa-austin": "Central",
    "northamerica-usa-sanantonio": "Central",
    "northamerica-usa-houston": "Central",
    "northamerica-usa-texasgulfcoast": "Central",
    "northamerica-usa-westtexas": "Central",
    "northamerica-usa-porcupinewilderness": "Central",  # Michigan's Upper Peninsula, not the Pacific NW

    # Southwest and Hawaii
    "northamerica-usa-hawaii": "Southwest and Hawaii",
    "northamerica-usa-oahu": "Southwest and Hawaii",
    "northamerica-usa-kauai": "Southwest and Hawaii",
    "northamerica-usa-losangeles2": "Southwest and Hawaii",
    "northamerica-usa-sandiego2": "Southwest and Hawaii",
    "northamerica-usa-sandiego3": "Southwest and Hawaii",
    "northamerica-usa-catalinaisland": "Southwest and Hawaii",
    "northamerica-usa-palmsprings": "Southwest and Hawaii",
    "northamerica-usa-lasvegas": "Southwest and Hawaii",
    "northamerica-usa-deathvalley": "Southwest and Hawaii",
    "northamerica-usa-grandcanyon": "Southwest and Hawaii",
    "northamerica-usa-monumentvalley": "Southwest and Hawaii",
    "northamerica-usa-whitesands": "Southwest and Hawaii",
    "northamerica-usa-carlsbadguadalupe": "Southwest and Hawaii",
    "northamerica-usa-felicity": "Southwest and Hawaii",
    "northamerica-usa-eaglenest": "Southwest and Hawaii",
    "northamerica-usa-santafe": "Southwest and Hawaii",
    "northamerica-usa-boisecity": "Southwest and Hawaii",  # OK panhandle, not Boise, ID

    # Northwest
    "northamerica-usa-bodie": "Northwest",
    "northamerica-usa-coeurdalene": "Northwest",
    "northamerica-usa-dinosaurnmco": "Northwest",
    "northamerica-usa-dinosaurnmut": "Northwest",
    "northamerica-usa-glaciernp": "Northwest",
    "northamerica-usa-greatbasinnp": "Northwest",
    "northamerica-usa-grandteton": "Northwest",
    "northamerica-usa-helena": "Northwest",
    "northamerica-usa-libby": "Northwest",
    "northamerica-usa-mountrainier": "Northwest",
    "northamerica-usa-northcascades": "Northwest",
    "northamerica-usa-northoregon": "Northwest",
    "northamerica-usa-olympicpeninsula": "Northwest",
    "northamerica-usa-portland": "Northwest",
    "northamerica-usa-rawlins": "Northwest",
    "northamerica-usa-sanfrancisco": "Northwest",
    "northamerica-usa-seattle": "Northwest",
    "northamerica-usa-seattle2": "Northwest",
    "northamerica-usa-seattle3": "Northwest",
    "northamerica-usa-seattlearea": "Northwest",
    "northamerica-usa-southoregon": "Northwest",
    "northamerica-usa-spokane": "Northwest",
    "northamerica-usa-centraloregon": "Northwest",
    "northamerica-usa-centralwashington": "Northwest",
    "northamerica-usa-easternwashington": "Northwest",
    "northamerica-usa-yellowstone": "Northwest",
    "northamerica-usa-yosemite": "Northwest",
    "northamerica-usa-brycezionnp": "Northwest",
    "northamerica-usa-archescanyonlandsnp": "Northwest",
    "northamerica-usa-saltlakecity": "Northwest",
    "northamerica-usa-coloradosprings": "Northwest",
    "northamerica-usa-denver": "Northwest",
    "northamerica-usa-rockymountain": "Northwest",
    "northamerica-usa-greatsanddunes": "Northwest",
    "northamerica-usa-silverton": "Northwest",
}

if __name__ == "__main__":
    files = glob.glob("src/content/entries/*.md")
    usa_ids = set()
    for path in files:
        text = open(path, encoding="utf-8").read()
        fm = text.split("---")[1]
        data = yaml.safe_load(fm)
        if data.get("trip") == "usa":
            usa_ids.add(path.split("/")[-1].replace(".md", ""))

    print("usa entries:", len(usa_ids))
    print("mapped:", len(REGIONS))
    missing = usa_ids - set(REGIONS.keys())
    extra = set(REGIONS.keys()) - usa_ids
    print("missing (usa entry with no region):", sorted(missing))
    print("extra (region entry not a usa entry):", sorted(extra))

    from collections import Counter
    counts = Counter(REGIONS.values())
    for region, count in counts.most_common():
        print(region, count)
