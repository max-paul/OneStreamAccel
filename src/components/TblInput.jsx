import { useRef, useState } from 'react';
import { parseCSV, generateTemplate, generateCSV, downloadTextFile } from '../utils/csv';

/**
 * TblInput — dynamic add/edit/delete table with optional CSV import/export.
 *
 * Props:
 *   cols       — column definitions: { key, label, type?, options?, ph?, default? }
 *   rows       — current row data
 *   onChange   — fn(newRows)
 *   addLabel   — text for the "+ Add row" button
 *   csvFilename — base filename (no extension) to enable CSV import/export,
 *                 e.g. "accounts" → template downloads as "accounts-template.csv"
 */
export default function TblInput({ cols, rows, onChange, addLabel, csvFilename }) {
  const fileInputRef = useRef(null);
  const [csvMsg, setCsvMsg]     = useState(null); // { type: 'success'|'warning'|'error', text }
  const [importMode, setImportMode] = useState('replace'); // 'replace' | 'append'

  // ── Table editing ──────────────────────────────────────────────────────────
  const addRow = () => {
    const empty = {};
    cols.forEach(c => (empty[c.key] = c.default || ''));
    onChange([...rows, empty]);
  };

  const updateRow = (i, key, val) =>
    onChange(rows.map((row, idx) => (idx === i ? { ...row, [key]: val } : row)));

  const delRow = (i) => onChange(rows.filter((_, idx) => idx !== i));

  // ── CSV download ───────────────────────────────────────────────────────────
  function handleDownloadTemplate() {
    downloadTextFile(generateTemplate(cols), `${csvFilename}-template.csv`);
  }

  function handleExportCurrent() {
    if (rows.length === 0) return;
    downloadTextFile(generateCSV(cols, rows), `${csvFilename}-export.csv`);
  }

  // ── CSV upload ─────────────────────────────────────────────────────────────
  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = ''; // reset so same file can be re-selected

    const reader = new FileReader();
    reader.onload = (ev) => {
      const { rows: parsed, warnings } = parseCSV(ev.target.result, cols);

      if (parsed.length === 0) {
        setCsvMsg({ type: 'error', text: 'No data rows found. Make sure the file has at least one data row below the header row.' });
        return;
      }

      const next = importMode === 'append' ? [...rows, ...parsed] : parsed;
      onChange(next);

      if (warnings.length > 0) {
        setCsvMsg({ type: 'warning', text: `Imported ${parsed.length} row${parsed.length !== 1 ? 's' : ''} with warnings: ${warnings.join(' ')}` });
      } else {
        setCsvMsg({ type: 'success', text: `${importMode === 'append' ? 'Appended' : 'Imported'} ${parsed.length} row${parsed.length !== 1 ? 's' : ''} successfully.` });
      }
      setTimeout(() => setCsvMsg(null), 5000);
    };
    reader.readAsText(file);
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div>
      {/* CSV toolbar — only shown when csvFilename prop is provided */}
      {csvFilename && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '12px',
          flexWrap: 'wrap',
        }}>
          {/* Download template */}
          <button
            type="button"
            className="btn btn-ghost"
            style={{ fontSize: '11.5px', padding: '0.3rem 0.8rem', gap: '5px' }}
            onClick={handleDownloadTemplate}
          >
            <i className="ti ti-file-download" style={{ fontSize: '13px' }} />
            Download CSV template
          </button>

          {/* Export current rows (only if data exists) */}
          {rows.length > 0 && (
            <button
              type="button"
              className="btn btn-ghost"
              style={{ fontSize: '11.5px', padding: '0.3rem 0.8rem', gap: '5px' }}
              onClick={handleExportCurrent}
            >
              <i className="ti ti-table-export" style={{ fontSize: '13px' }} />
              Export current data
            </button>
          )}

          {/* Divider */}
          <div style={{ width: '1px', height: '20px', background: 'var(--border2)', margin: '0 2px' }} />

          {/* Import mode toggle */}
          <select
            value={importMode}
            onChange={e => setImportMode(e.target.value)}
            style={{
              background: 'var(--bg3)', border: '1px solid var(--border2)',
              borderRadius: '6px', padding: '0.3rem 0.6rem',
              color: 'var(--text2)', fontSize: '11.5px', width: 'auto',
            }}
          >
            <option value="replace">Replace all rows</option>
            <option value="append">Append to existing</option>
          </select>

          {/* Upload trigger */}
          <button
            type="button"
            className="btn btn-ghost"
            style={{ fontSize: '11.5px', padding: '0.3rem 0.8rem', gap: '5px' }}
            onClick={() => fileInputRef.current?.click()}
          >
            <i className="ti ti-file-upload" style={{ fontSize: '13px' }} />
            Import CSV
          </button>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,text/csv"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
        </div>
      )}

      {/* Import feedback message */}
      {csvMsg && (
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '8px',
          padding: '0.6rem 0.875rem',
          borderRadius: '6px',
          marginBottom: '10px',
          fontSize: '12px',
          lineHeight: '1.5',
          background:
            csvMsg.type === 'success' ? 'rgba(34,197,94,0.08)' :
            csvMsg.type === 'warning' ? 'rgba(245,158,11,0.08)' :
            'rgba(239,68,68,0.08)',
          border:
            csvMsg.type === 'success' ? '1px solid rgba(34,197,94,0.25)' :
            csvMsg.type === 'warning' ? '1px solid rgba(245,158,11,0.25)' :
            '1px solid rgba(239,68,68,0.25)',
          color:
            csvMsg.type === 'success' ? 'var(--success)' :
            csvMsg.type === 'warning' ? 'var(--warning)' :
            'var(--danger)',
        }}>
          <i className={`ti ${
            csvMsg.type === 'success' ? 'ti-circle-check' :
            csvMsg.type === 'warning' ? 'ti-alert-triangle' :
            'ti-alert-circle'
          }`} style={{ flexShrink: 0, marginTop: '1px' }} />
          {csvMsg.text}
        </div>
      )}

      {/* Table */}
      <table className="table-input" style={{ width: '100%' }}>
        <thead>
          <tr>
            {cols.map(c => <th key={c.key}>{c.label}</th>)}
            <th />
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 && (
            <tr>
              <td colSpan={cols.length + 1} style={{
                textAlign: 'center', padding: '1.5rem', color: 'var(--text3)',
                fontSize: '12.5px', fontStyle: 'italic',
              }}>
                No rows yet — add one below{csvFilename ? ' or import a CSV' : ''}.
              </td>
            </tr>
          )}
          {rows.map((row, i) => (
            <tr key={i}>
              {cols.map(c => (
                <td key={c.key}>
                  {c.type === 'select' ? (
                    <select
                      value={row[c.key] || ''}
                      onChange={e => updateRow(i, c.key, e.target.value)}
                    >
                      {(c.options || []).map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={row[c.key] || ''}
                      placeholder={c.ph || ''}
                      onChange={e => updateRow(i, c.key, e.target.value)}
                    />
                  )}
                </td>
              ))}
              <td>
                <button className="del-btn" type="button" onClick={() => delRow(i)}>
                  <i className="ti ti-trash" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button className="add-row-btn" type="button" onClick={addRow}>
        <i className="ti ti-plus" />
        {addLabel || 'Add row'}
      </button>
    </div>
  );
}
