"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const util_1 = require("util");
const ejsRenderFile = (0, util_1.promisify)(require('ejs').renderFile);
const globP = (0, util_1.promisify)(require('glob'));
const site_config_1 = __importDefault(require("../site.config"));
const srcPath = './src';
const distPath = './public';
fs_extra_1.default.emptyDirSync(distPath);
fs_extra_1.default.copy(`${srcPath}/assets`, `${distPath}/assets`);
globP('**/*.ejs', { cwd: `${srcPath}/pages` })
    .then((files) => {
    files.forEach((file) => {
        const fileData = path_1.default.parse(file);
        const destPath = path_1.default.join(distPath, fileData.dir);
        fs_extra_1.default
            .mkdirs(destPath)
            .then(() => {
            return ejsRenderFile(`${srcPath}/pages/${file}`, Object.assign({}, site_config_1.default));
        })
            .then((pageContents) => {
            return ejsRenderFile(`${srcPath}/layout.ejs`, Object.assign({}, site_config_1.default, { body: pageContents }));
        })
            .then((layoutContent) => {
            fs_extra_1.default.writeFile(`${destPath}/${fileData.name}.html`, layoutContent);
        })
            .catch((err) => {
            console.error(err);
        });
    });
})
    .catch((err) => {
    console.error(err);
});
