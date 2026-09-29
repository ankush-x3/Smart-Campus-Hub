const fs = require('fs');
const glob = require('glob');
const files = glob.sync('client/src/**/*.jsx');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;
  if (content.match(/api\.(get|post|put|delete)\(\/api\//)) {
    content = content.replace(/api\.(get|post|put|delete)\(\/api\//g, "api.$1(\/");
    fs.writeFileSync(file, content);
    console.log('Fixed', file);
  }
});
