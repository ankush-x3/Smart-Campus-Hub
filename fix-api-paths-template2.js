const fs = require('fs');
const glob = require('glob');
const files = glob.sync('client/src/**/*.jsx');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes('/api/assignments') || content.includes('/api/events') || content.includes('/api/announcements') || content.includes('/api/resources')) {
    content = content.replace(/api\.(get|post|put|delete)\(\\/api\//g, "api.$1(\/");
    fs.writeFileSync(file, content);
  }
});
