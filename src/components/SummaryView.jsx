function Section({ title, icon, color, rows }) {
  const filtered = rows.filter((r) => r[1] != null && r[1] !== '');
  if (!filtered.length) return null;
  return (
    <div className="summary-block">
      <div className="summary-title">
        <i className={`ti ${icon}`} style={{ color: color || 'var(--accent)' }} />
        {title}
      </div>
      {filtered.map(([k, v]) => (
        <div key={k} className="summary-row">
          <span className="summary-key">{k}</span>
          <span className="summary-val">{v}</span>
        </div>
      ))}
    </div>
  );
}

function TableSection({ title, icon, color, headers, rows, rowMapper }) {
  if (!rows || rows.length === 0) return null;
  return (
    <div className="summary-block">
      <div className="summary-title">
        <i className={`ti ${icon}`} style={{ color: color || 'var(--accent)' }} />
        {title} <span style={{ fontSize: '11px', color: 'var(--text3)', fontWeight: '400', marginLeft: '6px' }}>({rows.length} {rows.length === 1 ? 'item' : 'items'})</span>
      </div>
      {rows.slice(0, 8).map((row, i) => (
        <div key={i} className="summary-row">
          {rowMapper(row)}
        </div>
      ))}
      {rows.length > 8 && (
        <div style={{ fontSize: '11px', color: 'var(--text3)', paddingTop: '6px' }}>
          + {rows.length - 8} more items — export to see full list
        </div>
      )}
    </div>
  );
}

export default function SummaryView({ project }) {
  if (!project) return null;
  const s    = project.steps || {};
  const app  = s['app-props']    || {};
  const time = s['time-profile'] || {};
  const scen = s['scenario']     || {};
  const curr = s['currency']     || {};
  const ent  = s['entity']       || {};
  const acct = s['accounts']     || {};
  const flow = s['flow-dim']     || {};
  const ud   = s['ud-dims']      || {};
  const cube = s['cube-props']   || {};
  const cdim = s['cube-dims']    || {};
  const ds   = s['data-source']  || {};
  const wf   = s['workflow']     || {};
  const ug   = s['user-groups']  || {};

  return (
    <div>
      {/* Phase 1 */}
      <Section
        title="Application Properties"
        icon="ti-building"
        rows={[
          ['Application Name', app.name],
          ['Application ID', app.appId],
          ['Default Currency', app.currency],
          ['Consolidation Method', app.consol],
          ['Platform Version', app.version],
          ['Implementation Type', app.implType],
          ['Consolidation Scope', app.consolScope],
          ['Industry', app.industry],
          ['Instance Type', app.instanceType],
          ['Environment', app.environment],
          ['Target Go-Live', app.goLiveTarget],
        ]}
      />

      <Section
        title="Time Profile"
        icon="ti-calendar"
        rows={[
          ['Year Range', app.name ? `${time.startYear || '?'} – ${time.endYear || '?'}` : null],
          ['Period Frequency', time.frequency],
          ['Fiscal Year End', time.fyEnd],
          ['Periods per Year', time.periods],
          ['Calendar Type', time.calendarType],
          ['Include Period 0', time.includeP0],
          ['Data Storage Method', time.ytdMethod],
        ]}
      />

      <TableSection
        title="Scenarios"
        icon="ti-layers-difference"
        rows={scen.scenarios || []}
        rowMapper={(sc) => (
          <>
            <span className="summary-key">{sc.name}</span>
            <span className="summary-val">{[sc.type, sc.lock ? `Lock: ${sc.lock}` : null, sc.defaultView].filter(Boolean).join(' · ')}</span>
          </>
        )}
      />

      <TableSection
        title="Currencies"
        icon="ti-currency-dollar"
        rows={curr.currencies || []}
        rowMapper={(c) => (
          <>
            <span className="summary-key">{c.code}</span>
            <span className="summary-val">{c.name}{c.default === 'Yes' ? ' · Reporting Currency' : ''}</span>
          </>
        )}
      />

      {/* Phase 2 */}
      {ent.topEntity && (
        <Section
          title="Entity Hierarchy"
          icon="ti-sitemap"
          color="var(--phase2)"
          rows={[
            ['Consolidation Root', ent.topEntity],
            ['Total Entities Defined', (ent.entities || []).length > 0 ? `${(ent.entities || []).length} entities` : null],
            ['Base Entities', (ent.entities || []).filter(e => e.type === 'Base').length > 0 ? `${(ent.entities || []).filter(e => e.type === 'Base').length} base entities` : null],
            ['Elimination Entities', (ent.entities || []).filter(e => e.type === 'Elimination').length > 0 ? `${(ent.entities || []).filter(e => e.type === 'Elimination').length} elimination entities` : null],
          ]}
        />
      )}

      <TableSection
        title="Chart of Accounts (sample)"
        icon="ti-list-details"
        color="var(--phase2)"
        rows={acct.accounts || []}
        rowMapper={(a) => (
          <>
            <span className="summary-key" style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '11px' }}>{a.code}</span>
            <span className="summary-val">{a.name}{a.type ? ` · ${a.type}` : ''}</span>
          </>
        )}
      />

      <TableSection
        title="Flow Members"
        icon="ti-arrows-exchange"
        color="var(--phase2)"
        rows={flow.flows || []}
        rowMapper={(f) => (
          <>
            <span className="summary-key">{f.name || f.displayName}</span>
            <span className="summary-val">{[f.type, f.translation].filter(Boolean).join(' · ')}</span>
          </>
        )}
      />

      <TableSection
        title="UD Dimensions Enabled"
        icon="ti-tag"
        color="var(--phase2)"
        rows={(ud.udDims || []).filter(d => d.enabled !== 'Disabled')}
        rowMapper={(d) => (
          <>
            <span className="summary-key">{d.ud}</span>
            <span className="summary-val">{d.name}{d.purpose ? ` — ${d.purpose}` : ''}</span>
          </>
        )}
      />

      {/* Phase 3 */}
      <TableSection
        title="Cubes"
        icon="ti-box"
        color="var(--phase3)"
        rows={cube.cubes || []}
        rowMapper={(c) => (
          <>
            <span className="summary-key">{c.cubeId || c.name}</span>
            <span className="summary-val">{c.type}{c.enableICP === 'Yes' ? ' · ICP Enabled' : ''}</span>
          </>
        )}
      />

      {/* Phase 4 */}
      <TableSection
        title="Data Sources"
        icon="ti-database"
        color="var(--phase4)"
        rows={ds.sources || []}
        rowMapper={(src) => (
          <>
            <span className="summary-key">{src.name}</span>
            <span className="summary-val">{src.type}{src.authMethod ? ` · ${src.authMethod}` : ''}</span>
          </>
        )}
      />

      {/* Phase 5 */}
      <TableSection
        title="Workflow Profiles"
        icon="ti-workflow"
        color="var(--phase5)"
        rows={wf.workflows || []}
        rowMapper={(w) => (
          <>
            <span className="summary-key">{w.name}</span>
            <span className="summary-val">{[w.frequency, w.scenario].filter(Boolean).join(' · ')}</span>
          </>
        )}
      />

      {/* Phase 6 */}
      <TableSection
        title="User Groups"
        icon="ti-users-group"
        color="var(--phase6)"
        rows={ug.groups || []}
        rowMapper={(g) => (
          <>
            <span className="summary-key">{g.name}</span>
            <span className="summary-val">{g.type}</span>
          </>
        )}
      />

      {/* Summary Totals */}
      <div style={{
        background: 'var(--bg2)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.25rem',
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '1rem',
        marginTop: '0.5rem',
      }}>
        {[
          { label: 'Entities', val: (ent.entities || []).length, icon: 'ti-sitemap' },
          { label: 'Accounts', val: (acct.accounts || []).length, icon: 'ti-list-details' },
          { label: 'Cubes', val: (cube.cubes || []).length, icon: 'ti-box' },
          { label: 'Scenarios', val: (scen.scenarios || []).length, icon: 'ti-layers-difference' },
        ].map(({ label, val, icon }) => (
          <div key={label} style={{ textAlign: 'center' }}>
            <i className={`ti ${icon}`} style={{ fontSize: '20px', color: 'var(--text3)', display: 'block', marginBottom: '6px' }} />
            <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '24px', fontWeight: '700', color: 'var(--text)' }}>{val}</div>
            <div style={{ fontSize: '11px', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
