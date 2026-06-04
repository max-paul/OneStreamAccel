import TblInput from '../TblInput';

const COLS = [
  { key: 'group',      label: 'User group', ph: 'e.g. Finance Admins' },
  { key: 'object',     label: 'Object type', type: 'select', options: ['Application', 'Cube', 'Workflow', 'Dashboard', 'Data', 'Report'] },
  { key: 'name',       label: 'Object name', ph: 'e.g. Consolidation Cube' },
  { key: 'permission', label: 'Permission', type: 'select', options: ['Full', 'Read/Write', 'Read Only', 'None'] },
];

export default function StepRoles({ data, onChange }) {
  const d = data || {};
  const f = (k, v) => onChange({ ...d, [k]: v });

  return (
    <div>
      <div className="form-card">
        <div className="form-card-title">
          <i className="ti ti-shield-check" />
          Role assignments
        </div>
        <TblInput cols={COLS} rows={d.roles || []} onChange={(r) => f('roles', r)} addLabel="Add role" />
      </div>
    </div>
  );
}
