import TblInput from '../TblInput';

const COLS = [
  { key: 'name', label: 'Flow member', ph: 'e.g. Opening' },
  { key: 'type', label: 'Type', type: 'select', options: ['Balance', 'Flow', 'Calculated'] },
  { key: 'desc', label: 'Description', ph: 'Optional' },
];

const DEFAULT_ROWS = [
  { name: 'Opening',  type: 'Balance' },
  { name: 'Movement', type: 'Flow' },
  { name: 'Closing',  type: 'Balance' },
];

export default function StepFlowDim({ data, onChange }) {
  const d = data || {};
  const f = (k, v) => onChange({ ...d, [k]: v });

  return (
    <div>
      <div className="form-card">
        <div className="form-card-title">
          <i className="ti ti-arrows-exchange" />
          Flow members
        </div>
        <TblInput cols={COLS} rows={d.flows || DEFAULT_ROWS} onChange={(r) => f('flows', r)} addLabel="Add flow member" />
      </div>
    </div>
  );
}
