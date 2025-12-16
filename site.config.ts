import { readFile } from "node:fs/promises";
export default {
	site: {
		title: "Characters",
		description: "Micro Static Site Generator in Node.js",
		chars: JSON.parse(
			await readFile("./src/data/characters.json", "utf-8")
		),
	},
};