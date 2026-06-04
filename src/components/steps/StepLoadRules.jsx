import TblInput from '../TblInput';

const COLS = [
  { key: 'name',     label: 'Rule name', ph: 'e.g. Actuals Load' },
  { key: 'source',   label: 'Data source', ph: 'e.g. ERP Data' },
  { key: 'cube',     label: 'Target cube', ph: 'e.g. Consolidation' },
  { key: 'scenario', label: 'Scenario', ph: 'e.g. Actual' },
  { key: 'method',   label: 'Load method', type: 'select', options: ['Merge', 'Replace', 'Accumulate'] },
];

export default function StepLoadRules({ data, onChange }) {
  const d = data || {};
  const f = (k, v) => onChange({ ...d, [k]: v });

  return (
    <div>
      <div className="form-card">
        <div className="form-card-title">
          <i className="ti ti-upload" />
          Data load rules
        </div>
        <TblInput cols={COLS} rows={d.loadRules || []} onChange={(r) => f('loadRules', r)} addLabel="Add load rule" />
      </div>
    </div>
  );
}
