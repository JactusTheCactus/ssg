import fse from "fs-extra";
import path from "path";
import ejs from "ejs";
import { glob } from "glob";
import htmlMinify from "html-minifier"
const minify = htmlMinify.minify
import config from "../site.config.js";
const [src, dist] = ["src", "public"].map((i) => `./${i}`);
fse.emptyDirSync(dist);
fse.copy(path.join(src, "assets"), path.join(dist, "assets"));
glob("**/*.ejs", { cwd: path.join(src, "pages") })
	.then((files) => {
		files.forEach((file) => {
			const data = path.parse(file);
			const dest = path.join(dist, data.dir);
			fse
				.ensureDir(dest)
				.then(() =>
					ejs.renderFile(path.join(src, "pages", file), config)
				)
				.then((page) =>
					ejs.renderFile(path.join(src, "layout.ejs"), {
						...config,
						body: page,
					})
				)
				.then((layout) => {
					fse.writeFile(
						path.join(dest, data.name + ".html"),
						minify(layout,{
removeComments:true,
removeCommentsFromCDATA:true,
//collapseWhitespace:true,
collapseBooleanAttributes:true,
removeAttributeQuotes:true,
removeRedundantAttributes:true,
useShortDoctype:true,
removeEmptyAttributes:true,
removeOptionalTags:true,
removeEmptyElements:true
						})
					);
				})
				.catch((err) => console.error(err));
		});
	})
	.catch((err) => {
		console.error(err);
	});
