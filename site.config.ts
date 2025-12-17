import { readFile } from "node:fs/promises";
export default {
	site: {
		title: "Characters",
		description: "Some of my OCs",
		chars: JSON.parse(
			await readFile("./src/data/characters.json", "utf-8")
		),
	},
};