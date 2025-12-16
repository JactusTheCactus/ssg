#!/usr/bin/env bash
set -euo pipefail
flag() {
	for f in "$@"
		do [[ -e ".flags/$f" ]] || return 1
	done
}
while read -r f
	do yq "$f" -p yaml -o json \
		| jq -c "." \
		> "$(echo "$f" \
			| perl -pe 's/yml/json/g'
		)"
done < <(find . -name "*.yml" ! -path "./node_modules/*")
tsc
npm run build