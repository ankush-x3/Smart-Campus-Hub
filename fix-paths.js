const fs = require('fs');
const glob = require('glob');
const files = glob.sync('client/src/pages/student/*.jsx');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/api\.get\('\/api\//g, "api.get('/");
  content = content.replace(/api\.post\('\/api\//g, "api.post('/");
  content = content.replace(/api\.put\('\/api\//g, "api.put('/");
  content = content.replace(/api\.delete\('\/api\//g, "api.delete('/");
  fs.writeFileSync(file, content);
});
console.log('Fixed API paths');
