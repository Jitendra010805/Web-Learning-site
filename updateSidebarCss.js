const fs = require('fs');

function updateSidebarCss(file) {
  let content = fs.readFileSync(file, 'utf8');

  content = content.replace(/background:\s*#ffffff;/g, 'background: var(--card-bg);');
  content = content.replace(/border-right:\s*1px solid #f0f0f5;/g, 'border-right: 1px solid var(--border-color);');
  content = content.replace(/border-bottom:\s*1px solid #f0f0f5;/g, 'border-bottom: 1px solid var(--border-color);');
  content = content.replace(/border-top:\s*1px solid #f0f0f5;/g, 'border-top: 1px solid var(--border-color);');
  content = content.replace(/background:\s*#e2e8f0;/g, 'background: var(--border-color);');

  content = content.replace(/color:\s*#1a1a2e;/g, 'color: var(--text-color);');
  content = content.replace(/color:\s*#94a3b8;/g, 'color: var(--text-muted);');
  content = content.replace(/color:\s*#64748b;/g, 'color: var(--text-muted);');
  
  content = content.replace(/color:\s*#4ade80;/g, 'color: var(--accent-color);');
  content = content.replace(/color:\s*#16a34a;/g, 'color: var(--accent-color);');
  
  content = content.replace(/background:\s*#f0fdf4;/g, 'background: color-mix(in srgb, var(--accent-color), transparent 90%);');
  
  content = content.replace(/background:\s*linear-gradient\(135deg, #d1fae5 0%, #bbf7d0 100%\);/g, 'background: color-mix(in srgb, var(--accent-color), transparent 80%);');
  content = content.replace(/color:\s*#15803d;/g, 'color: var(--accent-color);');
  content = content.replace(/rgba\(74, 222, 128, 0\.2\)/g, 'var(--shadow-sm)');

  content = content.replace(/background:\s*#fff1f2;/g, 'background: color-mix(in srgb, #ef4444, transparent 90%);');

  fs.writeFileSync(file, content);
  console.log('Updated ' + file);
}

updateSidebarCss('fronted/src/components/dashboard/sidebar.css');

