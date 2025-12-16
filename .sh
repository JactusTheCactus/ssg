#!/usr/bin/env bash
set -euo pipefail
flag() {
	for f in "$@"
		do [[ -e ".flags/$f" ]] || return 1
	done
}
rm -r logs > /dev/null 2>& 1 || :
mkdir -p logs
while read -r f
	do yq "$f" -p yaml -o json \
		| jq -c "." \
		> "${f%yml}json"
done < <(find . -name "*.yml" ! \( \
	-path "./node_modules/*" \
	-or \
	-name "scripts.yml" \
\))
cat "package.json" \
	| jq -c '.scripts=$scripts' \
	--argjson scripts "$(cat scripts.yml \
		| yq -p yaml -o json \
		| jq -c .
	)" \
	> package.json
tsc
npm run build
# npm run serve