const fs = require('fs');
const glob = require('glob');
const files = glob.sync('client/src/**/*.jsx');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;
  if (content.match(/([a-zA-Z0-9_]+)\.data\.map/)) {
    content = content.replace(/([a-zA-Z0-9_]+)\.data\.map/g, "($1.data.data || $1.data).map");
    fs.writeFileSync(file, content);
    console.log('Fixed generic', file);
  }
});
