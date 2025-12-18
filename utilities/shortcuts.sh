yml() {
	yq --yaml-fix-merge-anchor-to-spec=true "$@"
}