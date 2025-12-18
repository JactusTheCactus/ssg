_() {
	level=$1
	shift
	case $level in
		X)colour=1;;
		!)colour=3;;
		*)colour=2;;
	esac
	printf '\e[0;3%sm[%s] %s\e[0m\n' "$colour" "$level" "$*"
}
log() {
	_ " " "$@"
}
warn() {
	_ "!" "$@"
}
err() {
	_ "X" "$@" >& 2; exit 1
}