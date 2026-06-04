import TblInput from '../TblInput';

const CURRENCY_COLS = [
  { key: 'code',    label: 'ISO code', ph: 'e.g. USD' },
  { key: 'name',    label: 'Name', ph: 'e.g. US Dollar' },
  { key: 'default', label: 'Reporting currency', type: 'select', options: ['Yes', 'No'] },
];

const DEFAULT_ROWS = [{ code: 'USD', name: 'US Dollar', default: 'Yes' }];

export default function StepCurrency({ data, onChange }) {
  const d = data || {};
  const f = (k, v) => onChange({ ...d, [k]: v });

  return (
    <div>
      <div className="form-card">
        <div className="form-card-title">
          <i className="ti ti-currency-dollar" />
          Currencies
        </div>
        <TblInput
          cols={CURRENCY_COLS}
          rows={d.currencies || DEFAULT_ROWS}
          onChange={(r) => f('currencies', r)}
          addLabel="Add currency"
        />
      </div>

      <div className="form-card">
        <div className="form-card-title">
          <i className="ti ti-refresh" />
          Translation settings
        </div>
        <div className="form-grid">
          <div className="form-group">
            <label>Default rate type</label>
            <select value={d.rateType || 'Closing'} onChange={(e) => f('rateType', e.target.value)}>
              {['Closing', 'Average', 'Historical', 'Custom'].map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Translation method</label>
            <select value={d.transMethod || 'CTA'} onChange={(e) => f('transMethod', e.target.value)}>
              {['CTA', 'Retained Earnings', 'None'].map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
