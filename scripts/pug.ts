import fse from "fs-extra";
import path from "path";
import { glob } from "glob";
import pug from "pug";
import htmlMinify from "html-minifier";
const minify = htmlMinify.minify;
import config from "../site.config.js";
function mini(html) {
	return minify(html, {
		removeComments: true,
		removeCommentsFromCDATA: true,
		collapseWhitespace: true,
		collapseBooleanAttributes: true,
		removeAttributeQuotes: true,
		removeRedundantAttributes: true,
		useShortDoctype: true,
		removeEmptyAttributes: true,
		removeOptionalTags: true,
		removeEmptyElements: true,
	})
}
const [src, dist] = ["src", "public"].map((i) => `./${i}`);
fse.emptyDirSync(dist);
fse.copy(path.join(src, "assets"), path.join(dist, "assets"));
glob("**/*.pug", { cwd: path.join(src, "pages") })
	.then((files) => {
		files.forEach((file) => {
			const data = path.parse(file);
			const dest = path.join(dist, data.dir);
			fse.ensureDir(dest)
				.then(() =>
					pug.compileFile(path.join(src, "pages", file))(config)
				)
				.then((body) =>
					fse.writeFile(path.join("README.md"), mini(body))
					pug.compileFile(path.join(src, "layout.pug"))({
						...config,
						body,
					})
				)
				.then((layout) => {
					fse.writeFile(
						path.join(dest, data.name + ".html"),
						mini(layout)
					);
				})
				.catch((err) => console.error(err));
		});
	})
	.catch((err) => {
		console.error(err);
	});
