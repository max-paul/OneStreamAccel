import TblInput from '../TblInput';

const COLS = [
  { key: 'name', label: 'Cube name', ph: 'e.g. Consolidation' },
  { key: 'type', label: 'Cube type', type: 'select', options: ['Consolidation', 'Planning', 'Reporting', 'Analytics'] },
  { key: 'desc', label: 'Description', ph: 'Optional' },
];

export default function StepCubeProps({ data, onChange }) {
  const d = data || {};
  const f = (k, v) => onChange({ ...d, [k]: v });

  return (
    <div>
      <div className="form-card">
        <div className="form-card-title">
          <i className="ti ti-box" />
          Cubes
        </div>
        <TblInput cols={COLS} rows={d.cubes || []} onChange={(r) => f('cubes', r)} addLabel="Add cube" />
      </div>
    </div>
  );
}
