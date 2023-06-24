const fs = require('fs');
const path = require('path');

const packageJsonFile = path.resolve('package.json');
const versionFile = path.resolve('src', 'data', 'version.ts');
const { version } = JSON.parse(fs.readFileSync(packageJsonFile, 'utf-8'));
fs.writeFileSync(versionFile, `export const version = '${version}';\n`);
