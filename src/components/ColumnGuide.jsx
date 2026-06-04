import { useState } from 'react';

/**
 * Collapsible field-by-field reference guide for table-input steps.
 *
 * columns: Array<{
 *   col: string           — column header / field name
 *   desc: string          — what this field does and why it matters
 *   options?: Array<{ val: string, meaning: string }>  — optional option glossary
 * }>
 */
export default function ColumnGuide({ columns }) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ marginBottom: '1.25rem' }}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        style={{
          background: 'none',
          border: '1px solid var(--border2)',
          borderRadius: '6px',
          color: 'var(--text3)',
          fontSize: '11px',
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '5px',
          padding: '4px 10px',
          textTransform: 'uppercase',
          letterSpacing: '0.6px',
          fontWeight: '500',
          fontFamily: 'inherit',
          transition: 'all 0.15s',
        }}
        onMouseEnter={(e) => { e.target.style.color = 'var(--text2)'; e.target.style.borderColor = 'var(--border2)'; }}
        onMouseLeave={(e) => { e.target.style.color = 'var(--text3)'; }}
      >
        <i className={`ti ${open ? 'ti-chevron-down' : 'ti-chevron-right'}`} style={{ fontSize: '11px' }} />
        {open ? 'Hide' : 'Show'} column guide
      </button>

      {open && (
        <div style={{
          marginTop: '10px',
          background: 'var(--bg3)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius)',
          padding: '1rem 1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
        }}>
          {columns.map(({ col, desc, options }) => (
            <div key={col} style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: '16px', alignItems: 'start' }}>
              {/* Column label */}
              <div style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: '11px',
                color: 'var(--accent)',
                fontWeight: '500',
                paddingTop: '2px',
                lineHeight: '1.4',
              }}>
                {col}
              </div>

              {/* Description + options */}
              <div>
                <div style={{ fontSize: '12.5px', color: 'var(--text2)', lineHeight: '1.65', marginBottom: options ? '8px' : 0 }}>
                  {desc}
                </div>
                {options && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {options.map(({ val, meaning }) => (
                      <div key={val} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                        <code style={{
                          fontSize: '10.5px',
                          background: 'var(--bg2)',
                          border: '1px solid var(--border)',
                          padding: '1px 6px',
                          borderRadius: '4px',
                          flexShrink: 0,
                          color: 'var(--text)',
                          lineHeight: '1.8',
                          whiteSpace: 'nowrap',
                        }}>
                          {val}
                        </code>
                        <span style={{ fontSize: '11.5px', color: 'var(--text3)', lineHeight: '1.6' }}>{meaning}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
