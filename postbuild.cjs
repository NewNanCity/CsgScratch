const fs = require('fs');
const path = require('path');

const dist = path.resolve('dist');
const htmlHome = path.resolve('dist', 'html');
const htmlFrom = path.resolve('dist', 'html', 'main.html');
const htmlTo = path.resolve('dist', 'index.html');
// remove all .json file in dist
fs.readdirSync(dist).forEach(file => {
  if (file.endsWith('.json')) {
    fs.unlinkSync(path.resolve(dist, file));
  }
});
// copy html
fs.copyFileSync(htmlFrom, htmlTo);
// remove htmlHome
fs.rmSync(htmlHome, { recursive: true, force: true });
