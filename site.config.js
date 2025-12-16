"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const projects_json_1 = __importDefault(require("./src/data/projects.json"));
module.exports = {
    site: {
        title: 'NanoGen',
        description: 'Micro Static Site Generator in Node.js',
        projects: projects_json_1.default
    }
};
