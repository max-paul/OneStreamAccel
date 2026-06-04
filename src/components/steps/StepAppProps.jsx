const CURRENCIES = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY'];
const CONSOL_METHODS = ['Ownership', 'Equity', 'Proportional', 'None'];
const VERSIONS = ['9.x', '8.2', '8.1', '8.0'];

export default function StepAppProps({ data, onChange }) {
  const d = data || {};
  const f = (k, v) => onChange({ ...d, [k]: v });

  return (
    <div>
      <div className="form-card">
        <div className="form-card-title">
          <i className="ti ti-building" />
          General
        </div>
        <div className="form-grid">
          <div className="form-group">
            <label>App name</label>
            <input type="text" value={d.name || ''} placeholder="e.g. FP&A Platform" onChange={(e) => f('name', e.target.value)} />
          </div>
          <div className="form-group">
            <label>App ID</label>
            <input type="text" value={d.appId || ''} placeholder="e.g. FPA_PROD" onChange={(e) => f('appId', e.target.value)} />
          </div>
          <div className="form-group full">
            <label>Description</label>
            <textarea value={d.description || ''} placeholder="Describe the purpose..." onChange={(e) => f('description', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Default currency</label>
            <select value={d.currency || 'USD'} onChange={(e) => f('currency', e.target.value)}>
              {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Consolidation method</label>
            <select value={d.consol || 'Ownership'} onChange={(e) => f('consol', e.target.value)}>
              {CONSOL_METHODS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Platform version</label>
            <select value={d.version || '9.x'} onChange={(e) => f('version', e.target.value)}>
              {VERSIONS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
