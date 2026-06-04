import TblInput from '../TblInput';

const DIMS = ['Account','Entity','Scenario','Time','Flow','UD1','UD2','UD3','UD4','UD5','UD6','UD7','UD8','ICP'];

const COLS = [
  { key: 'cube',     label: 'Cube', ph: 'e.g. Consolidation' },
  { key: 'dim',      label: 'Dimension', type: 'select', options: DIMS },
  { key: 'required', label: 'Required', type: 'select', options: ['Yes', 'No'] },
  { key: 'notes',    label: 'Notes', ph: 'Optional' },
];

export default function StepCubeDims({ data, onChange }) {
  const d = data || {};
  const f = (k, v) => onChange({ ...d, [k]: v });

  return (
    <div>
      <div className="form-card">
        <div className="form-card-title">
          <i className="ti ti-grid-dots" />
          Cube dimension bindings
        </div>
        <TblInput cols={COLS} rows={d.cubeDims || []} onChange={(r) => f('cubeDims', r)} addLabel="Add binding" />
      </div>
    </div>
  );
}
