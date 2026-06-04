import TblInput from '../TblInput';

const COLS = [
  { key: 'name',     label: 'Template name', ph: 'e.g. Budget Input' },
  { key: 'scenario', label: 'Scenario', ph: 'e.g. Budget' },
  { key: 'type',     label: 'Type', type: 'select', options: ['Input', 'Spread', 'Commentary', 'Allocation'] },
  { key: 'cube',     label: 'Cube', ph: 'e.g. Planning' },
];

export default function StepTemplates({ data, onChange }) {
  const d = data || {};
  const f = (k, v) => onChange({ ...d, [k]: v });

  return (
    <div>
      <div className="form-card">
        <div className="form-card-title">
          <i className="ti ti-template" />
          Data collection templates
        </div>
        <TblInput cols={COLS} rows={d.templates || []} onChange={(r) => f('templates', r)} addLabel="Add template" />
      </div>
    </div>
  );
}
