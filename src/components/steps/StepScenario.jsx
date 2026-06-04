import InfoBox from '../InfoBox';
import TblInput from '../TblInput';
import ColumnGuide from '../ColumnGuide';

const DEFAULT_ROWS = [
  { id: 'Actual',   name: 'Actual',   type: 'Actual',   lock: 'Period', defaultView: 'Periodic', icpEnabled: 'Yes',  desc: 'Historical actuals loaded from ERP / GL systems' },
  { id: 'Budget',   name: 'Budget',   type: 'Budget',   lock: 'Year',   defaultView: 'YTD',      icpEnabled: 'No',   desc: 'Annual operating budget / plan' },
  { id: 'Forecast', name: 'Forecast', type: 'Forecast', lock: 'No',     defaultView: 'YTD',      icpEnabled: 'No',   desc: 'Rolling forecast — updated each close period' },
];

const COLS = [
  { key: 'id',          label: 'Member Name',  ph: 'e.g. Actual' },
  { key: 'name',        label: 'Display Name', ph: 'e.g. Actual' },
  { key: 'type',        label: 'Type',         type: 'select', options: ['Actual','Budget','Forecast','Rolling Forecast','Variance','Elimination','Statutory'] },
  { key: 'lock',        label: 'Lock Type',    type: 'select', options: ['No','Period','Year','All'] },
  { key: 'defaultView', label: 'Default View', type: 'select', options: ['Periodic','YTD','QTD'] },
  { key: 'icpEnabled',  label: 'ICP',          type: 'select', options: ['Yes','No'] },
  { key: 'desc',        label: 'Description',  ph: 'Brief description for users' },
];

const GUIDE = [
  {
    col: 'Member Name',
    desc: 'The technical identifier used in business rules, APIs, data loads, and system logs. Must be unique. No spaces or special characters — underscores are fine. Keep it short and self-explanatory.',
  },
  {
    col: 'Display Name',
    desc: 'The label users see in dashboards, selector dropdowns, and report headers. Can be more descriptive than the Member Name. For example, Member Name might be "RFC_Q3" while Display Name is "Q3 2025 Rolling Forecast".',
  },
  {
    col: 'Type',
    desc: 'Controls the scenario\'s behavior in consolidation calculations, variance analysis, and workflow.',
    options: [
      { val: 'Actual',           meaning: 'Historical reported data loaded from source systems. OneStream applies full consolidation logic. The Actual scenario is mandatory — every application must have one.' },
      { val: 'Budget',           meaning: 'Annual operating plan. Typically loaded once per year or maintained in planning templates. Variance analysis compares Budget to Actual automatically.' },
      { val: 'Forecast',         meaning: 'Updated projection of full-year results. Can be refreshed each period as new Actuals are known. Supports "rolling" patterns where past periods use Actuals.' },
      { val: 'Rolling Forecast', meaning: 'A forecast that always projects a fixed number of periods forward (e.g., always 12 months from today). Periods past close use Actuals; future periods use forecast inputs.' },
      { val: 'Variance',         meaning: 'Calculated scenario — typically "Budget vs. Actual" or "Forecast vs. Prior Year". Usually derived via business rules rather than direct data entry.' },
      { val: 'Elimination',      meaning: 'Intercompany elimination entries. Used when elimination journals are maintained as a separate scenario rather than being automatically calculated.' },
      { val: 'Statutory',        meaning: 'Statutory/local GAAP adjustments on top of the management Actual. Used when statutory reporting requires different accounting treatments from management reporting.' },
    ],
  },
  {
    col: 'Lock Type',
    desc: 'Determines whether historical data in this scenario is write-protected. Critical for data integrity in production.',
    options: [
      { val: 'No',     meaning: 'No protection. Data can be entered or modified at any time in any period. NEVER use for Actual in production — exposes historical data to accidental modification.' },
      { val: 'Period', meaning: 'Locks each period after it is formally closed. Only the current open period can be written to. Recommended setting for the Actual scenario.' },
      { val: 'Year',   meaning: 'Locks the entire fiscal year when triggered. Use for Budget scenarios once the annual plan has been board-approved and frozen.' },
      { val: 'All',    meaning: 'Completely frozen — no data entry or modification in any period. Use for retired scenarios or archived versions you want to preserve exactly.' },
    ],
  },
  {
    col: 'Default View',
    desc: 'The default aggregation method when users open this scenario in reports and dashboards.',
    options: [
      { val: 'Periodic', meaning: 'Shows each period\'s data independently (e.g., March revenue = March only). Standard for Actual P&L analysis.' },
      { val: 'YTD',      meaning: 'Year-to-date cumulative view (e.g., March YTD = Jan + Feb + Mar). Standard for Budget and Forecast scenarios where targets are YTD.' },
      { val: 'QTD',      meaning: 'Quarter-to-date view. Less common — used in industries where quarterly results are the primary reporting unit.' },
    ],
  },
  {
    col: 'ICP',
    desc: 'Whether Intercompany Partner (ICP) tracking is enabled for this scenario. Set to Yes for Actual and any scenario where intercompany transactions need to be tracked and eliminated. Set to No for planning scenarios where intercompany detail is not entered.',
  },
  {
    col: 'Description',
    desc: 'A brief user-facing description shown in scenario selectors and documentation. Helps end users understand the purpose and data source of each scenario.',
  },
];

export default function StepScenario({ data, onChange }) {
  const d = data || {};
  const f = (k, v) => onChange({ ...d, [k]: v });
  const rows = d.scenarios || DEFAULT_ROWS;

  return (
    <div>
      <InfoBox type="info" title="Scenario Dimension — Independent Data Buckets">
        Scenarios are the primary mechanism for separating different versions of financial data within the same application. <strong>Each scenario is completely independent</strong> — it has its own data, its own security, its own lock status, and its own consolidation state. The <strong>Actual scenario is mandatory</strong> and must always be the first scenario defined. All other scenarios are optional but highly recommended for planning implementations.
      </InfoBox>

      <div className="form-card">
        <div className="form-card-title"><i className="ti ti-layers-difference" />Scenario Members</div>
        <ColumnGuide columns={GUIDE} />
        <TblInput cols={COLS} rows={rows} onChange={(r) => f('scenarios', r)} addLabel="Add scenario" />
      </div>

      <InfoBox type="warning" title="Lock Type is Your Data Integrity Control — Set It Correctly">
        The Actual scenario with <strong>Lock Type = Period</strong> is the single most important data protection control in your OneStream application. Without it, any user with data write access can accidentally overwrite historical actuals. The Period lock means only the current open period can be modified — all prior periods become read-only automatically as they are closed. This is a SOX control point in audited environments.
      </InfoBox>

      <InfoBox type="tip" title="How Many Scenarios Do You Actually Need?">
        Resist the urge to create scenarios for every possible comparison. Start with the minimum and expand:<br />
        <strong>Phase 1 minimum:</strong> Actual + Budget + 1 Forecast<br />
        <strong>Common Phase 2 additions:</strong> Prior Year Actual (copy for easy YoY comparison), Long-Range Plan (3–5 year), Rolling 12-Month Forecast<br />
        <strong>Advanced:</strong> Multiple budget versions (Original Budget, Revised Budget), Stress-test scenarios<br /><br />
        Every additional scenario multiplies the number of data intersections and workflow units. Add scenarios with clear business justification.
      </InfoBox>
    </div>
  );
}
