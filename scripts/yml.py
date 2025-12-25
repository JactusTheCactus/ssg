import sys, yaml, json
print(json.dumps(yaml.safe_load(sys.stdin)))