import TblInput from '../TblInput';

const COLS = [
  { key: 'name',       label: 'Source name', ph: 'e.g. ERP Data' },
  { key: 'type',       label: 'Type', type: 'select', options: ['SQL Server','Oracle','CSV/Flat File','Excel','REST API','JDBC','Delimited'] },
  { key: 'connection', label: 'Connection string', ph: 'e.g. Server=...' },
  { key: 'desc',       label: 'Description', ph: 'Optional' },
];

export default function StepDataSource({ data, onChange }) {
  const d = data || {};
  const f = (k, v) => onChange({ ...d, [k]: v });

  return (
    <div>
      <div className="form-card">
        <div className="form-card-title">
          <i className="ti ti-database" />
          Data sources
        </div>
        <TblInput cols={COLS} rows={d.sources || []} onChange={(r) => f('sources', r)} addLabel="Add data source" />
      </div>
    </div>
  );
}
