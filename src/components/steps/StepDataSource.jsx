import InfoBox from '../InfoBox';
import TblInput from '../TblInput';
import ColumnGuide from '../ColumnGuide';

const COLS = [
  { key: 'name',       label: 'Source Name',         ph: 'e.g. SAP_ECC_GL_PROD' },
  { key: 'type',       label: 'Connector Type',       type: 'select', options: ['SQL Server','Oracle','SAP HANA','IBM Db2','PostgreSQL','CSV / Flat File','Excel (.xlsx)','REST API','JDBC','Delimited Text','Fixed Width','OneStream Connector'] },
  { key: 'authMethod', label: 'Authentication',       type: 'select', options: ['Windows Integrated','SQL Server Auth','Basic (Username/Password)','OAuth 2.0','API Key','Certificate','XFCredential Vault (Recommended)'] },
  { key: 'connection', label: 'Connection Reference', ph: 'e.g. Server=ERPDB01;Database=GL;' },
  { key: 'desc',       label: 'Description',          ph: 'e.g. SAP ECC Production GL — actuals, owned by IT Finance' },
];

const DS_GUIDE = [
  {
    col: 'Source Name',
    desc: 'A unique identifier for this connection profile. Follow the [SYSTEM]_[MODULE]_[ENV] convention. Examples: SAP_ECC_GL_PROD, ORACLE_AR_QA, CSV_BUDGET_STAGING, HYPERION_HIST_ARCHIVE. This name is referenced in transformation rules and load jobs — keep it stable across environments (only the connection string changes between environments, not the name).',
  },
  {
    col: 'Connector Type',
    desc: 'The technology used to connect to the source system. OneStream provides native connectors for major database platforms and file types.',
    options: [
      { val: 'SQL Server',          meaning: 'Direct ODBC/ADO.NET connection to Microsoft SQL Server. Most common for Microsoft Dynamics, Epicor, and custom SQL databases.' },
      { val: 'Oracle',              meaning: 'Oracle ODP.NET connection. Used for Oracle EBS, Oracle Fusion/Cloud, and Oracle databases generally.' },
      { val: 'SAP HANA',            meaning: 'SAP HANA ODBC connector for direct database-level access to SAP S/4HANA or SAP BW/4HANA.' },
      { val: 'CSV / Flat File',     meaning: 'Comma-separated value files. Most flexible option — any source system can usually export to CSV. Good fallback when direct DB connection is not available.' },
      { val: 'Excel (.xlsx)',       meaning: 'Direct Excel workbook loading. Useful for manual adjustments, supplemental data, or when source systems can only export to Excel.' },
      { val: 'REST API',            meaning: 'HTTP/HTTPS API calls. Used for cloud-based sources (Salesforce, Workday, cloud ERPs). Requires API authentication setup.' },
      { val: 'JDBC',                meaning: 'Java Database Connectivity — used for databases without native OneStream connectors. More complex to configure but highly flexible.' },
      { val: 'OneStream Connector', meaning: 'Connect from one OneStream application to another. Used for cross-application data sharing or when loading from a staging OneStream environment.' },
    ],
  },
  {
    col: 'Authentication',
    desc: 'How OneStream authenticates to the source system when establishing the connection.',
    options: [
      { val: 'Windows Integrated',          meaning: 'Uses the Windows service account running OneStream. Zero credential management — but requires the service account to have appropriate DB permissions. Best for on-premise SQL Server environments.' },
      { val: 'SQL Server Auth',             meaning: 'SQL username/password stored in the connection string. Simple but requires credential rotation management.' },
      { val: 'Basic (Username/Password)',   meaning: 'Standard username/password for file sources or REST APIs. Store credentials in XFCredential Vault in production.' },
      { val: 'XFCredential Vault (Recommended)', meaning: 'OneStream\'s built-in encrypted credential store. Credentials are stored securely and referenced by name. Enables credential rotation without modifying connection configurations. Required for SOC 2 / ISO 27001 compliance.' },
    ],
  },
  {
    col: 'Connection Reference',
    desc: 'The connection string or vault reference for this data source. In Development, you may use direct connection strings. In Production, this should reference an XFCredential vault entry. Format varies by connector type: SQL Server: "Server=SQLSRV01;Database=GL;", CSV: folder path, API: base URL.',
  },
  {
    col: 'Description',
    desc: 'Document what this source contains, who owns it, when it was last validated, and any special handling notes. Include the source system version, data owner contact, and the data refresh frequency. This is your operations runbook for each connection.',
  },
];

export default function StepDataSource({ data, onChange }) {
  const d = data || {};
  const f = (k, v) => onChange({ ...d, [k]: v });

  return (
    <div>
      <InfoBox type="info" title="Data Sources — Connection Profiles to Your Source Systems">
        Data Sources define how OneStream connects to the systems from which financial data is loaded. Each data source is a reusable connection object — define it once, reference it across multiple transformation rules and load jobs. Proper naming and documentation here pays dividends when you're debugging a failed data load at 11pm on close day and need to quickly identify which connection is failing.
      </InfoBox>

      <div className="form-card">
        <div className="form-card-title"><i className="ti ti-database" />Data Sources</div>
        <ColumnGuide columns={DS_GUIDE} />
        <TblInput cols={COLS} rows={d.sources || []} onChange={(r) => f('sources', r)} addLabel="Add data source" />
      </div>

      <InfoBox type="critical" title="Production Security — Use XFCredential Vault, Not Embedded Passwords">
        Embedding database passwords in connection strings is a critical security vulnerability that will be flagged in any security audit. OneStream's <strong>XFCredential Vault</strong> stores credentials encrypted at rest with role-based access control. Once stored in the vault, credentials can be rotated centrally without touching any connection configurations. Reference vault credentials using the syntax <code>XFCredential:[VaultName]</code> in your connection strings. This is a <strong>non-negotiable requirement</strong> for any production deployment.
      </InfoBox>

      <InfoBox type="tip" title="Multi-Environment Strategy — Same Names, Different Connections">
        The most common data integration mistake in multi-environment deployments: using different data source names in Dev vs. QA vs. Prod. When you promote transformation rules, they reference the data source name — if the name changes between environments, every rule breaks.<br /><br />
        <strong>Correct approach:</strong> Use identical data source names in all environments (<code>SAP_ECC_GL_PROD</code> in all three). Only the connection string (or vault entry) differs. This allows seamless promotion of transformation rules and load jobs without environment-specific modifications.
      </InfoBox>
    </div>
  );
}
