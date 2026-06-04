import TblInput from '../TblInput';

const COLS = [
  { key: 'source', label: 'Source field', ph: 'e.g. GL_ACCOUNT' },
  { key: 'target', label: 'Target dim', type: 'select', options: ['Account','Entity','Scenario','UD1','UD2','UD3','UD4','UD5'] },
  { key: 'method', label: 'Method', type: 'select', options: ['Direct','Lookup','Calculated','Default','Substitution'] },
  { key: 'notes',  label: 'Notes', ph: 'Optional' },
];

export default function StepTransform({ data, onChange }) {
  const d = data || {};
  const f = (k, v) => onChange({ ...d, [k]: v });

  return (
    <div>
      <div className="form-card">
        <div className="form-card-title">
          <i className="ti ti-transform" />
          Transformation rules
        </div>
        <TblInput cols={COLS} rows={d.transforms || []} onChange={(r) => f('transforms', r)} addLabel="Add rule" />
      </div>
    </div>
  );
}
