#!/usr/bin/env bash
set -euo pipefail
flag() {
	for f in "$@"
		do [[ -e ".flags/$f" ]] || return 1
	done
}
yml() {
	yq --yaml-fix-merge-anchor-to-spec=true "$@"
}
if ! flag local
	then
		apt-get update
		command -v jq >/dev/null || { echo "jq missing"; exit 1; }
		command -v yq >/dev/null || { echo "yq missing"; exit 1; }
fi
rm -r logs > /dev/null 2>& 1 || :
mkdir -p logs
if flag local
	then exec > logs/main.log 2>& 1
fi
while read -r f
	do yml "$f" -p yaml -o json | jq -c "." > "${f%yml}json"
done < <(find . -name "*.yml" ! \( -path "./node_modules/*" -or -name "scripts.yml" \))
while read -r f
	do npx sass "$f:${f%scss}css" --no-source-map --style=compressed
done < <(find . -name "*.scss")
tsc
node scripts/build.js
find . -type d -empty -delete
if flag local
	then : #npx serve ./public
fi