import TblInput from '../TblInput';

const COLS = [
  { key: 'name',  label: 'Cert name', ph: 'e.g. Balance Sheet Cert' },
  { key: 'type',  label: 'Type', type: 'select', options: ['Account Reconciliation', 'Workflow', 'Data Quality', 'Custom'] },
  { key: 'owner', label: 'Owner group', ph: 'e.g. Finance Team' },
  { key: 'freq',  label: 'Frequency', type: 'select', options: ['Monthly', 'Quarterly', 'Annual'] },
];

export default function StepCertification({ data, onChange }) {
  const d = data || {};
  const f = (k, v) => onChange({ ...d, [k]: v });

  return (
    <div>
      <div className="form-card">
        <div className="form-card-title">
          <i className="ti ti-certificate" />
          Certification profiles
        </div>
        <TblInput cols={COLS} rows={d.certifications || []} onChange={(r) => f('certifications', r)} addLabel="Add certification" />
      </div>
    </div>
  );
}
