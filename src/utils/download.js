import { generateXML } from './xml';

function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a   = document.createElement('a');
  a.href     = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function downloadJSON(project) {
  const blob = new Blob([JSON.stringify(project, null, 2)], { type: 'application/json' });
  const name = (project.name || 'onestream-project').replace(/\s+/g, '-').toLowerCase();
  triggerDownload(blob, `${name}.json`);
}

export function downloadXML(project) {
  const blob = new Blob([generateXML(project)], { type: 'application/xml' });
  const name = (project.name || 'onestream-app').replace(/\s+/g, '-').toLowerCase();
  triggerDownload(blob, `${name}-v9.xml`);
}

// Generators are loaded on demand — not at app startup — so they don't block initial render
export async function downloadOSFile(project, filename) {
  const { GENERATORS } = await import('./generators/index');
  const gen = GENERATORS.find(g => g.filename === filename);
  if (!gen) return;
  const content = gen.generate(project);
  triggerDownload(new Blob([content], { type: 'application/xml' }), filename);
}

export async function downloadAllOSFiles(project) {
  const { generateAllFiles } = await import('./generators/index');
  const files = generateAllFiles(project);
  files.forEach(({ filename, content }, i) => {
    setTimeout(() => {
      triggerDownload(new Blob([content], { type: 'application/xml' }), filename);
    }, i * 300);
  });
}
