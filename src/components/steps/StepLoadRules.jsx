import InfoBox from '../InfoBox';
import TblInput from '../TblInput';
import ColumnGuide from '../ColumnGuide';

const COLS = [
  { key: 'name',       label: 'Load Rule Name',       ph: 'e.g. SAP_Actuals_Monthly_CONSOL' },
  { key: 'source',     label: 'Data Source',           ph: 'e.g. SAP_ECC_GL_PROD' },
  { key: 'cube',       label: 'Target Cube',           ph: 'e.g. CONSOL' },
  { key: 'scenario',   label: 'Target Scenario',       ph: 'e.g. Actual' },
  { key: 'method',     label: 'Load Method',           type: 'select', options: ['Merge (add/update)','Replace (clear period first)','Accumulate (sum on top)'] },
  { key: 'clearFirst', label: 'Clear Before Load',     type: 'select', options: ['No','Yes — Clear target scope first'] },
];

const LR_GUIDE = [
  {
    col: 'Load Rule Name',
    desc: 'A descriptive name that identifies what this rule loads, from where, and to where. Recommended convention: [SOURCE]_[CONTENT]_[FREQUENCY]_[CUBE]. Examples: SAP_Actuals_Monthly_CONSOL, ORACLE_AR_Quarterly_CONSOL, CSV_Budget_Annual_PLAN. This name appears in audit logs — make it self-explanatory.',
  },
  {
    col: 'Data Source',
    desc: 'The Data Source name (defined in the previous step) from which this load rule pulls data. Must exactly match the Source Name from your Data Sources configuration. One load rule references one data source — create separate load rules for each source-target combination.',
  },
  {
    col: 'Target Cube',
    desc: 'The Cube ID (from Cube Properties) where this data will be written. Must exactly match the Cube ID. Common: CONSOL for actuals consolidation data, PLAN_FIN for budget/forecast data.',
  },
  {
    col: 'Target Scenario',
    desc: 'The Scenario Member Name (from Scenario Setup) this data will be loaded into. Must exactly match the scenario\'s Member Name. Critical: make sure the target scenario is not locked before attempting a data load, or the load will fail.',
  },
  {
    col: 'Load Method',
    desc: 'How the incoming data interacts with any existing data in the target scope.',
    options: [
      { val: 'Merge (add/update)',           meaning: 'RECOMMENDED for most use cases. New data overwrites existing values for the same dimensional intersections. Intersections not in the incoming data are left unchanged. Re-running the same load with the same source data is idempotent — no duplication. Safe for incremental refreshes.' },
      { val: 'Replace (clear period first)', meaning: 'Clears all existing data for the targeted period/scenario combination BEFORE loading the incoming data. Use when your source extract is a complete, authoritative snapshot of a period (e.g., a full month-end GL extract). Running this twice with the same data gives the same result — no duplication risk.' },
      { val: 'Accumulate (sum on top)',       meaning: 'DANGEROUS — adds incoming values ON TOP of existing values without clearing. Running this twice doubles the data. Only use in specific scenarios where multiple independent feeds are intentionally summed together, and NEVER re-run without clearing first. Most data integrity issues in production trace back to accidental use of Accumulate.' },
    ],
  },
  {
    col: 'Clear Before Load',
    desc: 'An additional explicit clear step that runs before the load regardless of Load Method. Provides an extra safety net for Replace-type operations or when you want to ensure a clean slate. Adds processing time. Use with Replace method for maximum data integrity confidence.',
  },
];

export default function StepLoadRules({ data, onChange }) {
  const d = data || {};
  const f = (k, v) => onChange({ ...d, [k]: v });

  return (
    <div>
      <InfoBox type="info" title="Data Load Rules — The Final Mile of Data Integration">
        Load rules are the last step in the data pipeline: they take transformed, dimension-mapped data and write it into a specific cube and scenario combination. Each load rule is a discrete, auditable event recorded in the OneStream PortalActivity log — timestamp, user, source, target, record count, status, and any errors. This log is your primary tool for diagnosing data load issues during close.
      </InfoBox>

      <div className="form-card">
        <div className="form-card-title"><i className="ti ti-upload" />Data Load Rules</div>
        <ColumnGuide columns={LR_GUIDE} />
        <TblInput cols={COLS} rows={d.loadRules || []} onChange={(r) => f('loadRules', r)} addLabel="Add load rule" csvFilename="load-rules" />
      </div>

      <InfoBox type="warning" title="Accumulate Method — The #1 Cause of Production Data Corruption">
        The Accumulate load method adds incoming data <em>on top of</em> existing data without any clearing. If an operator runs an Accumulate load twice (which happens more often than you think — system timeouts, operator error, automation retry logic), the data in OneStream is doubled. <strong>Doubled actuals are not immediately obvious</strong> — they may pass automated checks and only be caught when reconciling to source totals.<br /><br />
        In 10 years of OneStream implementations, the Accumulate method has caused more close-night data crises than any other single feature. <strong>Use Merge for almost everything. If you think you need Accumulate, reconsider and use Merge with a pre-clear step instead.</strong>
      </InfoBox>

      <InfoBox type="tip" title="Post-Load Reconciliation — Build It Into Your Close Process">
        Every load rule should have a corresponding post-load reconciliation check built into the close checklist:<br />
        <strong>1. Record count check:</strong> Did we load the expected number of records?<br />
        <strong>2. Total amount check:</strong> Does the sum of loaded amounts match the source system control total?<br />
        <strong>3. Period balance check:</strong> Does the current period balance in OneStream agree to the signed-off GL trial balance?<br />
        <strong>4. UNMAPPED check:</strong> Is the UNMAPPED_ACCOUNT balance zero? If not, the mapping needs investigation before sign-off.<br /><br />
        These four checks should be a OneStream dashboard visible to the Controller on close day — not a manual spreadsheet process.
      </InfoBox>
    </div>
  );
}
