import TblInput from '../TblInput';

const COLS = [
  { key: 'code',   label: 'Account code', ph: 'e.g. 1000' },
  { key: 'name',   label: 'Account name', ph: 'e.g. Revenue' },
  { key: 'type',   label: 'Account type', type: 'select', options: ['Revenue', 'Expense', 'Asset', 'Liability', 'Equity', 'Statistical', 'Flow'] },
  { key: 'flow',   label: 'Flow type', type: 'select', options: ['Flow', 'Balance', 'AverageBalance', 'EndBalance'] },
  { key: 'icp',    label: 'ICP enabled', type: 'select', options: ['No', 'Yes'] },
  { key: 'parent', label: 'Parent account', ph: 'e.g. Total Revenue' },
];

export default function StepAccounts({ data, onChange }) {
  const d = data || {};
  const f = (k, v) => onChange({ ...d, [k]: v });

  return (
    <div>
      <div className="form-card">
        <div className="form-card-title">
          <i className="ti ti-list-details" />
          Chart of accounts
        </div>
        <TblInput cols={COLS} rows={d.accounts || []} onChange={(r) => f('accounts', r)} addLabel="Add account" />
      </div>
    </div>
  );
}
