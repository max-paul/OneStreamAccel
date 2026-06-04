function Section({ title, icon, rows }) {
  const filtered = rows.filter((r) => r[1]);
  if (!filtered.length) return null;
  return (
    <div className="summary-block">
      <div className="summary-title">
        <i className={`ti ${icon}`} style={{ color: 'var(--accent)' }} />
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

export default function SummaryView({ project }) {
  if (!project) return null;
  const s        = project.steps || {};
  const app      = s['app-props']    || {};
  const time     = s['time-profile'] || {};
  const scen     = s['scenario']     || {};
  const curr     = s['currency']     || {};
  const entity   = s['entity']       || {};
  const accounts = s['accounts']     || {};
  const cubes    = s['cube-props']   || {};

  return (
    <div>
      <Section
        title="Application"
        icon="ti-building"
        rows={[['Name', app.name], ['App ID', app.appId], ['Currency', app.currency], ['Consol method', app.consol], ['Version', app.version], ['Description', app.description]]}
      />
      <Section
        title="Time profile"
        icon="ti-calendar"
        rows={[['Period', `${time.startYear || '?'} – ${time.endYear || '?'}`], ['Frequency', time.frequency], ['FY end', time.fyEnd], ['Periods', time.periods]]}
      />

      {(scen.scenarios || []).length > 0 && (
        <div className="summary-block">
          <div className="summary-title">
            <i className="ti ti-layers-difference" style={{ color: 'var(--accent)' }} />
            Scenarios
          </div>
          {scen.scenarios.map((sc) => (
            <div key={sc.name} className="summary-row">
              <span className="summary-key">{sc.name}</span>
              <span className="summary-val">{`${sc.type} · Lock: ${sc.lock}`}</span>
            </div>
          ))}
        </div>
      )}

      {(curr.currencies || []).length > 0 && (
        <div className="summary-block">
          <div className="summary-title">
            <i className="ti ti-currency-dollar" style={{ color: 'var(--accent)' }} />
            Currencies
          </div>
          {curr.currencies.map((c) => (
            <div key={c.code} className="summary-row">
              <span className="summary-key">{c.code}</span>
              <span className="summary-val">{`${c.name}${c.default === 'Yes' ? ' · Reporting' : ''}`}</span>
            </div>
          ))}
        </div>
      )}

      <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1rem', fontSize: '13px', color: 'var(--text3)', textAlign: 'center' }}>
        {`${(entity.entities || []).length} entities · ${(accounts.accounts || []).length} accounts · ${(cubes.cubes || []).length} cubes configured`}
      </div>
    </div>
  );
}
