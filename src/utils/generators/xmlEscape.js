export function esc(val) {
  if (val == null) return '';
  return String(val)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export const OS_VERSION = '9.3.0.18429';

export function osHeader() {
  return [
    '<?xml version="1.0" encoding="utf-8"?>',
    `<OneStreamXF version="${OS_VERSION}">`,
  ];
}

export function osFooter() {
  return ['</OneStreamXF>'];
}

// Indent helper — returns string with depth*2 spaces
export function ind(depth) {
  return '  '.repeat(depth);
}
