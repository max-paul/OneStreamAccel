import TblInput from '../TblInput';

const COLS = [
  { key: 'workflow', label: 'Workflow', ph: 'e.g. Monthly Close' },
  { key: 'group',    label: 'User group', ph: 'e.g. Finance Admins' },
  { key: 'role',     label: 'Workflow role', type: 'select', options: ['Owner', 'Preparer', 'Reviewer', 'Approver', 'Read Only'] },
  { key: 'scope',    label: 'Scope', ph: 'e.g. All Entities' },
];

export default function StepWorkflowSec({ data, onChange }) {
  const d = data || {};
  const f = (k, v) => onChange({ ...d, [k]: v });

  return (
    <div>
      <div className="form-card">
        <div className="form-card-title">
          <i className="ti ti-lock" />
          Workflow security
        </div>
        <TblInput cols={COLS} rows={d.wfSec || []} onChange={(r) => f('wfSec', r)} addLabel="Add security rule" />
      </div>
    </div>
  );
}
