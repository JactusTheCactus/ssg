import fse from "fs-extra";
import path from "path";
import { glob } from "glob";
import pug from "pug";
import htmlMinifier from "html-minifier";
import config from "../site.config.js";
function mini(html) {
    return htmlMinifier.minify(html, {
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
    });
}
function render(file, data) {
    return mini(pug.compileFile(path.join(...file))(data));
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
            .then(() => render([src, "pages", file], config))
            .then((body) => {
            if (data.name === "index") {
                fse.writeFile("README.md", body);
            }
            return render([src, "layout.pug"], { ...config, content: body });
        })
            .then((layout) => fse.writeFile(path.join(dest, `${data.name}.html`), layout))
            .catch((err) => console.error(err));
    });
})
    .catch((err) => console.error(err));
