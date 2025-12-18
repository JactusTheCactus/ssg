flag() {
	for f in "$@"
		do [[ -e ".flags/$f" ]] || return 1
	done
}