import { readFile } from "node:fs/promises";
const projects = JSON.parse(
	await readFile(
		new URL(
			"./src/data/projects.json",
			import.meta.url
		),
		"utf-8"
	)
)
export default {
	site: {
		title: "NanoGen",
		description: "Micro Static Site Generator in Node.js",
		projects
	}
}