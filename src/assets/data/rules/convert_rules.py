import re
import json


def strip_parts(row: iter) -> list:
    return list(map(str.strip, row))


# will break from/to query into separate entries
# output schema: [[description, label, fromQuery, toQuery]]
def process_diacritics(input_file: str, output_file: str) -> None:
    parsed = []
    with open(input_file) as diacriticsData:
        parsed = []
        for line in diacriticsData:
            description, label, query = line.rstrip().split(";")
            label = label.strip()
            if re.match("\\d+", label):
                print("numeral")
                label = chr(int(label))
            fromQuery, toQuery = query.split(">")
            parsed.append(strip_parts((description, label, fromQuery, toQuery)))
    with open(output_file, "w") as output:
        output.write(json.dumps(parsed))


# output schema: [[fromQuery, toQuery]]
def process_dependencies(input_file: str, output_file: str) -> None:
    with open(input_file) as dependenciesData:
        parsed = [strip_parts(line.split(">")) for line in dependenciesData]
    with open(output_file, "w") as output:
        output.write(json.dumps(parsed))


# output schema: [query]
def process_contradictions(input_file: str, output_file: str) -> None:
    with open(input_file) as contradictionsData:
        parsed = strip_parts(line for line in contradictionsData)
    with open(output_file, "w") as output:
        output.write(json.dumps(parsed))


# process .rules files into .json data to directly import
if __name__ == "__main__":
    process_diacritics("diacritics.rules", "diacritics.json")
    process_dependencies("dependencies.rules", "dependencies.json")
    process_contradictions("contradictions.rules", "contradictions.json")
