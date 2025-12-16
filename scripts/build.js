import fse from "fs-extra";
import path from "path";
import { promisify } from "util";
import ejs from "ejs";
import { glob } from "glob";
import config from "../site.config.js";
const [src, dist] = ["src", "public"].map((i) => `./${i}`);
fse.emptyDirSync(dist);
fse.copy(`${src}/assets`, `${dist}/assets`);
promisify(glob)("**/*.ejs", { cwd: `${src}/pages` })
    .then((files) => {
    files.forEach((file) => {
        const fileData = path.parse(file);
        const dest = path.join(dist, fileData.dir);
        fse.mkdirs(dest)
            .then(() => ejs.renderFile(`${src}/pages/${file}`, Object.assign({}, config)))
            .then((page) => ejs.renderFile(`${src}/layout.ejs`, Object.assign({}, config, { body: page })))
            .then((layout) => fse.writeFile(`${dest}/${fileData.name}.html`, layout))
            .catch((err) => console.error(err));
    });
})
    .catch((err) => {
    console.error(err);
});
