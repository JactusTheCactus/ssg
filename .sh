#!/usr/bin/env bash
set -euo pipefail
while read -r util
	do source "$util"
done < <(find utilities -name "*.sh")
rm -r logs > /dev/null 2>& 1 || :
mkdir -p logs
if flag local
	then
		exec 3>& 1 4>& 2
		exec > logs/main.log 2>& 1
	else
		echo "=========="
		npm i -h
		echo "=========="
		npm i \
			--no-fund \
			--no-audit
		echo "=========="
fi
find . \
	-name "*.json" \( \
		-path "./src/data/*" \
		-or -path "./.vscode/*" \
		-or -name "tsconfig.json" \
	\) \
	! -path "./node_modules/*" \
	-delete
while read -r f
	do yml "$f" -p yaml -o json | jq -c "." > "${f%yml}json"
done < <(find . \
	-name "*.yml" \
	! \( \
		-name "scripts.yml" \
		-o -name ".editorconfig.yml" \
		-o -path "./.github/*" \
		-o -path "./node_modules/*" \
	\)
) \
	&& log YML files successfully converted to JSON \
	|| err YML files could not be converted to JSON
if flag local
	then rm .editorconfig && dasel -r yaml -w toml \
		< .editorconfig.yml \
		| sed -z "
			s|\\n\\s*\\n\\+|\\n|g
			s|'\\(\\S*\\?\\)'|\\1|g
			s|  |\\t|g
		" \
		> .editorconfig 2>& 1 \
		&& log .editorconfig.yml successfully converted to .editorconfig \
		|| err .editorconfig.yml could not be converted to .editorconfig
fi
find . -name "*.css" -delete
while read -r f
	do npx sass "$f:${f%scss}css" --no-source-map --style=compressed
done < <(find . -name "*.scss") \
	&& log SCSS files successfully compiled to CSS \
	|| err SCSS files could not be compiled to CSS
tsc
node scripts/pug.js \
	&& log PUG files successfully compiled to HTML \
	|| err PUG files could not be compiled to HTML
find public -name "*.scss" -delete
find src -name "*.css" -delete
find . -type d -empty -delete
echo
log Build Complete!
if flag local
	then cat logs/main.log >& 3 && sleep 1
fi