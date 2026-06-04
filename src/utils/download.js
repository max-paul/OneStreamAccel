import { generateXML } from './xml';

function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
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
