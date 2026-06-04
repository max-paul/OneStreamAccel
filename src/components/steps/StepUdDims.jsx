import TblInput from '../TblInput';

const COLS = [
  { key: 'ud',      label: 'Dimension', type: 'select', options: ['UD1','UD2','UD3','UD4','UD5','UD6','UD7','UD8'] },
  { key: 'name',    label: 'Business name', ph: 'e.g. Cost Center' },
  { key: 'purpose', label: 'Purpose', ph: 'e.g. Department tracking' },
  { key: 'enabled', label: 'Enabled', type: 'select', options: ['Yes', 'No'] },
];

export default function StepUdDims({ data, onChange }) {
  const d = data || {};
  const f = (k, v) => onChange({ ...d, [k]: v });

  return (
    <div>
      <div className="form-card">
        <div className="form-card-title">
          <i className="ti ti-tag" />
          User-defined dimensions (UD1–UD8)
        </div>
        <TblInput cols={COLS} rows={d.udDims || []} onChange={(r) => f('udDims', r)} addLabel="Add UD dimension" />
      </div>
    </div>
  );
}
