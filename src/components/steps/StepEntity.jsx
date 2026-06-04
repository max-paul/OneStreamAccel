import TblInput from '../TblInput';

const COLS = [
  { key: 'name',     label: 'Entity name', ph: 'e.g. US Operations' },
  { key: 'parent',   label: 'Parent', ph: 'e.g. Total Company' },
  { key: 'currency', label: 'Local currency', ph: 'e.g. USD' },
  { key: 'type',     label: 'Type', type: 'select', options: ['Base', 'Parent', 'ICP', 'Elimination'] },
  { key: 'consol',   label: 'Consol method', type: 'select', options: ['Owned', 'Equity', 'Proportional', 'None'] },
];

export default function StepEntity({ data, onChange }) {
  const d = data || {};
  const f = (k, v) => onChange({ ...d, [k]: v });

  return (
    <div>
      <div className="form-card">
        <div className="form-card-title">
          <i className="ti ti-sitemap" />
          Entity hierarchy
        </div>
        <div className="form-group" style={{ marginBottom: '1rem' }}>
          <label>Top-level entity name</label>
          <input
            type="text"
            value={d.topEntity || ''}
            placeholder="e.g. Total Company"
            onChange={(e) => f('topEntity', e.target.value)}
          />
        </div>
        <TblInput cols={COLS} rows={d.entities || []} onChange={(r) => f('entities', r)} addLabel="Add entity" />
      </div>
    </div>
  );
}
