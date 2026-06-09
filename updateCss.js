const fs = require('fs');

function updateCss(file) {
  let content = fs.readFileSync(file, 'utf8');

  content = content.replace(/Hardcoded Light/g, 'Dynamic Theme');

  content = content.replace(/background:\s*#ffffff;/g, 'background: var(--card-bg);');
  content = content.replace(/background:\s*rgba\(255,\s*255,\s*255,\s*0\.82\);/g, 'background: var(--glass-bg);');
  content = content.replace(/background-color:\s*#ffffff;/g, 'background-color: var(--card-bg);');
  content = content.replace(/background:\s*rgba\(255,\s*255,\s*255,\s*0\.9\);/g, 'background: var(--glass-bg);');
  
  content = content.replace(/background:\s*#f8fafc;/g, 'background: var(--bg-color);');
  content = content.replace(/background:\s*#f1f5f9;/g, 'background: var(--border-color);');
  
  content = content.replace(/color:\s*#0f172a;/g, 'color: var(--text-color);');
  content = content.replace(/color:\s*#1a1a2e;/g, 'color: var(--text-color);');
  content = content.replace(/color:\s*#1e293b;/g, 'color: var(--text-color);');
  content = content.replace(/color:\s*#94a3b8;/g, 'color: var(--text-muted);');
  content = content.replace(/color:\s*#64748b;/g, 'color: var(--text-muted);');
  content = content.replace(/color:\s*#475569;/g, 'color: var(--text-muted);');
  
  content = content.replace(/border(-color)?:\s*#e2e8f0;/g, 'border$1: var(--border-color);');
  content = content.replace(/border:\s*1px solid #e2e8f0;/g, 'border: 1px solid var(--border-color);');
  content = content.replace(/border:\s*1\.5px solid #e2e8f0;/g, 'border: 1.5px solid var(--border-color);');
  content = content.replace(/border:\s*2px solid #e2e8f0;/g, 'border: 2px solid var(--border-color);');
  content = content.replace(/border:\s*1px solid rgba\(255,\s*255,\s*255,\s*0\.95\);/g, 'border: 1px solid var(--glass-border);');
  content = content.replace(/border:\s*1px solid rgba\(255,\s*255,\s*255,\s*0\.9\);/g, 'border: 1px solid var(--glass-border);');
  
  fs.writeFileSync(file, content);
  console.log('Updated ' + file);
}

updateCss('fronted/src/pages/dashboard/Dashboard.css');
updateCss('fronted/src/admin/Dashboard/admindashboard.css');

