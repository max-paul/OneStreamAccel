const FREQUENCIES = ['Monthly', 'Quarterly', 'Weekly', 'Daily'];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

export default function StepTimeProfile({ data, onChange }) {
  const d = data || {};
  const f = (k, v) => onChange({ ...d, [k]: v });

  return (
    <div>
      <div className="form-card">
        <div className="form-card-title">
          <i className="ti ti-calendar" />
          Time configuration
        </div>
        <div className="form-grid">
          <div className="form-group">
            <label>Start year</label>
            <input type="number" value={d.startYear || ''} placeholder="2020" onChange={(e) => f('startYear', e.target.value)} />
          </div>
          <div className="form-group">
            <label>End year</label>
            <input type="number" value={d.endYear || ''} placeholder="2030" onChange={(e) => f('endYear', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Period frequency</label>
            <select value={d.frequency || 'Monthly'} onChange={(e) => f('frequency', e.target.value)}>
              {FREQUENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Fiscal year end</label>
            <select value={d.fyEnd || 'December'} onChange={(e) => f('fyEnd', e.target.value)}>
              {MONTHS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Number of periods</label>
            <input type="number" value={d.periods || ''} placeholder="12" onChange={(e) => f('periods', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Prior periods</label>
            <input type="number" value={d.priorPeriods || ''} placeholder="3" onChange={(e) => f('priorPeriods', e.target.value)} />
          </div>
        </div>
      </div>
    </div>
  );
}
