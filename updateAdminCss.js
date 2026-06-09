const fs = require('fs');

function updateAdminCss(file) {
  let content = fs.readFileSync(file, 'utf8');

  content = content.replace(/#4ade80/gi, 'var(--accent-color)');
  content = content.replace(/#22c55e/gi, 'var(--accent-dark)');
  
  content = content.replace(/background:\s*#f0fdf4;/g, 'background: color-mix(in srgb, var(--accent-color), transparent 90%);');
  content = content.replace(/color:\s*#16a34a;/g, 'color: var(--accent-color);');
  
  // Also we have rgba(255,255,255,0.95), let's replace them if any
  content = content.replace(/rgba\(255,255,255,0\.95\)/g, 'var(--card-bg)');
  content = content.replace(/rgba\(255,\s*255,\s*255,\s*0\.82\)/g, 'var(--glass-bg)');
  content = content.replace(/rgba\(255,\s*255,\s*255,\s*0\.9\)/g, 'var(--glass-border)');
  
  fs.writeFileSync(file, content);
  console.log('Updated admin css colors');
}

updateAdminCss('fronted/src/admin/Dashboard/admindashboard.css');

