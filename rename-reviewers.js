const fs = require('fs');
const path = require('path');

const baseDir = __dirname;
const files = [
  'admin/app/(dashboard)/reviewers/page.tsx',
  'admin/app/api/admin/reviewers/route.ts',
  'admin/app/api/admin/reviewers/[id]/route.ts',
  'admin/app/api/admin/dashboard/route.ts',
  'admin/components/AdminSidebar.tsx',
  'admin/app/(dashboard)/proposals/page.tsx',
  'admin/app/(dashboard)/proposals/[id]/page.tsx',
  'admin/app/api/admin/proposals/[id]/assign-reviewer/route.ts',
  'admin/app/api/public/stats/route.ts',
  'admin/app/api/setup/seed/route.ts'
];

files.forEach(f => {
  const filePath = path.join(baseDir, f);
  if (!fs.existsSync(filePath)) {
    console.log('Skipping missing file:', filePath);
    return;
  }
  let content = fs.readFileSync(filePath, 'utf8');
  
  if (f === 'admin/app/api/admin/dashboard/route.ts' || f === 'admin/app/api/public/stats/route.ts' || f === 'admin/app/api/setup/seed/route.ts') {
    content = content.replace(/import Researcher from '@\/lib\/models\/Researcher';/g, "import Reviewer from '@/lib/models/Reviewer';\nimport Researcher from '@/lib/models/Researcher';");
    content = content.replace(/totalResearchers/g, 'totalReviewers');
    content = content.replace(/Researcher\.countDocuments/g, 'Reviewer.countDocuments');
    content = content.replace(/Researcher\.create/g, 'Reviewer.create');
  } else if (f === 'admin/components/AdminSidebar.tsx') {
    content = content.replace(/\{ name: 'Researchers', path: '\/researchers' \}/g, "{ name: 'Reviewers', path: '/reviewers' }");
  } else {
    // In reviewers pages and APIs and proposals
    content = content.replace(/Researchers/g, 'Reviewers');
    content = content.replace(/researchers/g, 'reviewers');
    content = content.replace(/Researcher/g, 'Reviewer');
    content = content.replace(/researcher/g, 'reviewer');
  }
  
  fs.writeFileSync(filePath, content);
  console.log('Processed', f);
});
