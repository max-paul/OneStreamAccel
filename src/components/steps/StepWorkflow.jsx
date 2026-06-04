import TblInput from '../TblInput';

const COLS = [
  { key: 'name',      label: 'Profile name', ph: 'e.g. Monthly Close' },
  { key: 'frequency', label: 'Frequency', type: 'select', options: ['Monthly', 'Quarterly', 'Annual', 'Ad-hoc'] },
  { key: 'scenario',  label: 'Scenario', ph: 'e.g. Actual' },
  { key: 'steps',     label: 'Steps', ph: 'e.g. Input, Review, Approve' },
];

export default function StepWorkflow({ data, onChange }) {
  const d = data || {};
  const f = (k, v) => onChange({ ...d, [k]: v });

  return (
    <div>
      <div className="form-card">
        <div className="form-card-title">
          <i className="ti ti-workflow" />
          Workflow profiles
        </div>
        <TblInput cols={COLS} rows={d.workflows || []} onChange={(r) => f('workflows', r)} addLabel="Add workflow" />
      </div>
    </div>
  );
}
