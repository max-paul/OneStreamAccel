import TblInput from '../TblInput';

const COLS = [
  { key: 'name', label: 'Group name', ph: 'e.g. Finance Admins' },
  { key: 'type', label: 'Type', type: 'select', options: ['Administrator', 'Power User', 'User', 'Read Only', 'Data Entry'] },
  { key: 'desc', label: 'Description', ph: 'Optional' },
];

export default function StepUserGroups({ data, onChange }) {
  const d = data || {};
  const f = (k, v) => onChange({ ...d, [k]: v });

  return (
    <div>
      <div className="form-card">
        <div className="form-card-title">
          <i className="ti ti-users-group" />
          User groups
        </div>
        <TblInput cols={COLS} rows={d.groups || []} onChange={(r) => f('groups', r)} addLabel="Add group" />
      </div>
    </div>
  );
}
