import {parse} from "node:querystring";

const releaseVersion = parse(process.env["RELEASE_VERSION"]);

console.log(releaseVersion)