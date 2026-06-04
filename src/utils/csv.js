/** Escape a single value for CSV output. */
function csvEsc(val) {
  const str = String(val == null ? '' : val);
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
}

/**
 * Parse a single CSV row, respecting quoted fields and escaped double-quotes.
 */
function parseRow(line) {
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') { // escaped quote
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += ch;
    }
  }
  result.push(current);
  return result;
}

/**
 * Parse a CSV string into an array of plain objects.
 * First row is treated as headers; subsequent rows are data.
 * Returns { rows, warnings } — warnings lists any header mismatches.
 */
export function parseCSV(text, cols) {
  const lines = text
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .split('\n')
    .filter(l => l.trim());

  if (lines.length < 1) return { rows: [], warnings: ['File appears to be empty.'] };

  const headers    = parseRow(lines[0]).map(h => h.trim());
  const warnings   = [];

  // Build label → key map from cols
  const labelToKey = {};
  for (const col of cols) {
    labelToKey[col.label.toLowerCase()] = col.key;
    labelToKey[col.key.toLowerCase()]   = col.key; // also accept key directly
  }

  // Validate headers
  const colMap = headers.map(h => {
    const key = labelToKey[h.toLowerCase()];
    if (!key) warnings.push(`Column "${h}" not recognised — it will be ignored.`);
    return key || null;
  });

  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const values = parseRow(line);
    const obj    = {};

    // Initialise all keys to empty so missing columns get a blank
    cols.forEach(c => { obj[c.key] = ''; });

    colMap.forEach((key, idx) => {
      if (key) obj[key] = (values[idx] || '').trim();
    });

    rows.push(obj);
  }

  return { rows, warnings };
}

/**
 * Generate a CSV template string.
 * Row 1 — column headers (labels).
 * Row 2 — example / hint row so users know what format each column expects.
 */
export function generateTemplate(cols) {
  const headers  = cols.map(c => csvEsc(c.label));
  const examples = cols.map(c => {
    if (c.type === 'select' && c.options?.length) {
      return csvEsc(c.options[0]);
    }
    return csvEsc(c.ph || '');
  });
  return [headers.join(','), examples.join(',')].join('\r\n') + '\r\n';
}

/**
 * Generate a CSV string from the current table rows (headers + data).
 * Useful for "export current data" flows.
 */
export function generateCSV(cols, rows) {
  const headers = cols.map(c => csvEsc(c.label));
  const lines   = [headers.join(',')];
  for (const row of rows) {
    lines.push(cols.map(c => csvEsc(row[c.key] ?? '')).join(','));
  }
  return lines.join('\r\n') + '\r\n';
}

/** Trigger a browser download of a text file. */
export function downloadTextFile(content, filename, mimeType = 'text/csv') {
  const blob = new Blob([content], { type: mimeType });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
