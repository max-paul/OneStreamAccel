import InfoBox from '../InfoBox';
import TblInput from '../TblInput';
import ColumnGuide from '../ColumnGuide';

const COLS = [
  { key: 'cubeId',    label: 'Cube ID',       ph: 'e.g. CONSOL' },
  { key: 'name',      label: 'Display Name',  ph: 'e.g. Consolidation' },
  { key: 'type',      label: 'Cube Type',     type: 'select', options: ['Consolidation','Planning','Reporting','Analytics','Statistical'] },
  { key: 'enableICP', label: 'Enable ICP',    type: 'select', options: ['Yes','No'] },
  { key: 'desc',      label: 'Description',   ph: 'e.g. Primary group consolidation — Actual, Budget, Forecast' },
];

const CUBE_GUIDE = [
  {
    col: 'Cube ID',
    desc: 'The permanent technical identifier for this cube. Used in all business rules, APIs, and system references. No spaces — underscores only. Uppercase convention. This CANNOT be changed after data has been loaded into the cube. Choose carefully: CONSOL, PLAN_FIN, STAT_KPI, REPORT_MGMT.',
  },
  {
    col: 'Display Name',
    desc: 'The human-readable cube name shown to users in dropdowns, dashboards, and template selectors. Can include spaces and mixed case.',
  },
  {
    col: 'Cube Type',
    desc: 'Defines the primary purpose of this cube. Affects available features, default settings, and recommended dimension bindings.',
    options: [
      { val: 'Consolidation', meaning: 'Primary cube for actuals consolidation. Supports full intercompany elimination, minority interest, and multi-currency translation. Must have Account, Entity, Scenario, Time, and Consolidation Method dimensions. This is the cube type for your main financial close process.' },
      { val: 'Planning',      meaning: 'Designed for budget, forecast, and rolling forecast data entry. Typically has fewer dimensions than the Consolidation cube (no Flow, no ICP) to simplify the input model for planners. Supports workflow, templates, and spreading functionality.' },
      { val: 'Reporting',     meaning: 'Pre-calculated, formatted data cube for high-performance reporting. Data is derived from the Consolidation or Planning cubes via business rules and stored here for fast query performance. Useful for executive dashboards with complex pre-aggregated KPIs.' },
      { val: 'Analytics',     meaning: 'Flexible cube for what-if analysis, scenario modeling, and ad-hoc analysis. Not part of the formal close or planning process. Used by finance analysts for sensitivity analysis and model exploration.' },
      { val: 'Statistical',   meaning: 'Dedicated cube for non-financial KPIs, operational metrics, and ESG data. Uses Statistical account types. Keeps non-financial data cleanly separated from financial data without mixing account types in the main cube.' },
    ],
  },
  {
    col: 'Enable ICP',
    desc: 'Adds the Intercompany Partner (ICP) dimension to this cube. Only enable on the Consolidation cube (or any cube where intercompany elimination is required). ICP significantly increases cube complexity and size. Enabling ICP means every data entry for ICP-flagged accounts must specify a counterparty entity — never enable on Planning cubes unless your planners genuinely need to enter intercompany plans by counterparty.',
  },
  {
    col: 'Description',
    desc: 'Document the scope, purpose, primary users, and key scenarios for this cube. This becomes part of the configuration record for future consultants and system administrators.',
  },
];

const CUBE_TYPE_HINTS = {
  'Consolidation': 'Full consolidation engine — intercompany elimination, minority interest, multi-currency translation. The core of your financial close.',
  'Planning':      'Budget/forecast input engine — templates, workflow, spreading, seeding. Simplified dimensions for planner usability.',
  'Reporting':     'High-performance read cube — pre-calculated KPIs stored for fast dashboard queries. Populated via business rules from other cubes.',
  'Analytics':     'Free-form analysis cube — what-if scenarios, model exploration, sensitivity analysis. Not part of formal close/planning.',
  'Statistical':   'Non-financial KPI cube — operational metrics, ESG data, headcount, units. Keeps financial and non-financial data cleanly separated.',
};

export default function StepCubeProps({ data, onChange }) {
  const d = data || {};
  const f = (k, v) => onChange({ ...d, [k]: v });

  return (
    <div>
      <InfoBox type="info" title="Cubes — Independent Data Stores With Shared Dimensions">
        A cube in OneStream is a multi-dimensional data store — think of it as a highly structured database organized by your configured dimensions. Cubes share dimension definitions (the same Account hierarchy, the same Entity hierarchy) but hold <strong>completely independent data</strong>. A Consolidation cube and a Planning cube share the same accounts and entities but each has its own separate data set. Cubes are the primary unit of security access in OneStream.
      </InfoBox>

      <div className="form-card">
        <div className="form-card-title"><i className="ti ti-box" />Cube Definitions</div>
        <ColumnGuide columns={CUBE_GUIDE} />
        <TblInput cols={COLS} rows={d.cubes || []} onChange={(r) => f('cubes', r)} addLabel="Add cube" />
      </div>

      <InfoBox type="tip" title="How Many Cubes? Start With One.">
        The vast majority of Phase 1 implementations need <strong>exactly one cube</strong>: the Consolidation cube. Add additional cubes only when dimension requirements genuinely differ:<br /><br />
        <strong>Add a Planning cube if:</strong> Planners need a simpler input model without Flow or ICP dimensions, or if you need to separate plan data completely from actuals for security reasons.<br />
        <strong>Add a Statistical cube if:</strong> You have significant non-financial KPI reporting (headcount, units, ESG) that would clutter the main financial cube.<br />
        <strong>Add a Reporting cube if:</strong> Executive dashboards require complex pre-calculated metrics at very high query performance standards.<br /><br />
        Multiple cubes add maintenance overhead — every metadata change (new entity, new account) may need to be applied to multiple cubes. More cubes = more ongoing work.
      </InfoBox>

      <InfoBox type="warning" title="Cube ID is Permanent — Choose It Like You'll Have It Forever">
        The Cube ID appears in business rules, API calls, data load scripts, transformation rules, and security configurations. Once data has been loaded, changing a Cube ID requires: exporting all data, deleting and recreating the cube with the new ID, reimporting all data, and updating every business rule, template, and security object that references the old ID. In practice, this is a full rebuilding exercise. <strong>Treat the Cube ID with the same care as the Application ID.</strong>
      </InfoBox>
    </div>
  );
}
