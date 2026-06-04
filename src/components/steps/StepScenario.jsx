import TblInput from '../TblInput';

const DEFAULT_ROWS = [
  { name: 'Actual',   type: 'Actual',   lock: 'No' },
  { name: 'Budget',   type: 'Budget',   lock: 'No' },
  { name: 'Forecast', type: 'Forecast', lock: 'No' },
];

const COLS = [
  { key: 'name', label: 'Scenario name', ph: 'e.g. Actual' },
  { key: 'type', label: 'Type', type: 'select', options: ['Actual', 'Budget', 'Forecast', 'Rolling Forecast', 'Variance'] },
  { key: 'lock', label: 'Lock type', type: 'select', options: ['No', 'Year', 'Period', 'All'] },
  { key: 'desc', label: 'Description', ph: 'Optional' },
];

export default function StepScenario({ data, onChange }) {
  const d = data || {};
  const f = (k, v) => onChange({ ...d, [k]: v });
  const rows = d.scenarios || DEFAULT_ROWS;

  return (
    <div>
      <div className="form-card">
        <div className="form-card-title">
          <i className="ti ti-layers-difference" />
          Scenarios
        </div>
        <TblInput cols={COLS} rows={rows} onChange={(r) => f('scenarios', r)} addLabel="Add scenario" />
      </div>
    </div>
  );
}
