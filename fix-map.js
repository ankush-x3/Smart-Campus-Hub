const fs = require('fs');
const glob = require('glob');
const files = glob.sync('client/src/**/*.jsx');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes('res.data.map')) {
    content = content.replace(/res\.data\.map/g, "(res.data.data || res.data).map");
    fs.writeFileSync(file, content);
    console.log('Fixed', file);
  }
});
console.log('Done mapping fix');
