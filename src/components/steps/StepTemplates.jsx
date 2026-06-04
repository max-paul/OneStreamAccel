import InfoBox from '../InfoBox';
import TblInput from '../TblInput';
import ColumnGuide from '../ColumnGuide';

const COLS = [
  { key: 'name',       label: 'Template Name',      ph: 'e.g. FY_Budget_PL_Input' },
  { key: 'scenario',   label: 'Target Scenario',     ph: 'e.g. Budget' },
  { key: 'type',       label: 'Input Type',          type: 'select', options: ['Direct Input','Spread (distribute total)','Driver-Based Input','Commentary / Narrative','Allocation','Seeding from Actuals','Seeding from Prior Budget'] },
  { key: 'cube',       label: 'Target Cube',         ph: 'e.g. PLAN_FIN' },
  { key: 'inputLevel', label: 'Input Level',          type: 'select', options: ['Entity only','Entity + UD1 (Cost Center)','Entity + UD2 (Product)','Entity + UD1 + UD2','Entity + UD3 (Project)','Custom'] },
];

const TMPL_GUIDE = [
  {
    col: 'Template Name',
    desc: 'A descriptive name that tells users exactly what they\'re entering data for. Convention: [Process]_[Scenario]_[Type]_[Input Area]. Examples: FY_Budget_PL_Input, Monthly_RFC_Headcount, Q3_Forecast_CapEx_Detail. The name appears in template selectors and workflow task lists.',
  },
  {
    col: 'Target Scenario',
    desc: 'The OneStream Scenario Member Name that this template writes data into. Users must have write access to this scenario to use the template. Make sure the target scenario is not locked when users are expected to enter data.',
  },
  {
    col: 'Input Type',
    desc: 'The data entry methodology this template uses.',
    options: [
      { val: 'Direct Input',            meaning: 'Users type values directly into account/period cells. The most common and simplest approach. Good for P&L accounts where planners enter monthly amounts by account.' },
      { val: 'Spread (distribute total)', meaning: 'User enters a single total (e.g., full-year revenue) and OneStream distributes it across periods using a seasonal spread pattern. Excellent for top-line budgeting where exact monthly phasing is defined by a pattern rather than line-by-line entry.' },
      { val: 'Driver-Based Input',       meaning: 'Users enter business drivers (e.g., headcount, price, volume) and business rules calculate the financial outcomes (e.g., salary expense = headcount × average salary). More sophisticated — requires business rule development but drives better management engagement.' },
      { val: 'Commentary / Narrative',   meaning: 'Text-based template for entering budget rationale, variance explanations, or qualitative context. Stored alongside the financial data and included in reporting packs.' },
      { val: 'Allocation',               meaning: 'Shared cost allocation templates. A central cost pool is entered once and then allocated to receiving entities or cost centers based on configured drivers (headcount, revenue, equal split, etc.).' },
      { val: 'Seeding from Actuals',     meaning: 'Pre-populates the Budget or Forecast template with actual data (often prior year actuals × growth rate). This gives planners a starting point rather than a blank sheet — dramatically reduces input time and improves budget quality.' },
      { val: 'Seeding from Prior Budget', meaning: 'Pre-populates from the prior year\'s budget or current year\'s original budget. Used for rolling forecast workflows where planners update from a baseline rather than rebuilding from zero.' },
    ],
  },
  {
    col: 'Target Cube',
    desc: 'The Cube ID where this template writes data. Must be a cube with Planning or appropriate write permissions for the target scenario. Typically the PLAN_FIN cube for budget/forecast templates. Do not write planning data to the Consolidation cube unless you have a specific design reason to do so.',
  },
  {
    col: 'Input Level',
    desc: 'The dimensional granularity at which users enter data in this template. Directly determines template complexity and the number of input cells.',
    options: [
      { val: 'Entity only',            meaning: 'Simplest — one input per account per period per entity. Good for P&L templates where entity finance enters total amounts. Minimizes the number of cells and keeps templates fast and user-friendly.' },
      { val: 'Entity + UD1',           meaning: 'Input by cost center within each entity. Allows departmental budget ownership. Good for OpEx templates where each cost center manager enters their own budget. Note: this multiplies input cells by the number of cost centers.' },
      { val: 'Entity + UD2',           meaning: 'Input by product/service line. Good for revenue planning templates where product managers enter their revenue forecasts. Most applicable to revenue and COGS accounts.' },
      { val: 'Entity + UD1 + UD2',     meaning: 'Matrix input by cost center AND product. Very granular — best avoided unless there\'s a specific business need. Large number of input cells, complex to maintain.' },
      { val: 'Entity + UD3',           meaning: 'Input at project/CapEx level. Used for capital expenditure templates where each project is a UD3 member. Essential for CapEx planning modules.' },
    ],
  },
];

export default function StepTemplates({ data, onChange }) {
  const d = data || {};
  const f = (k, v) => onChange({ ...d, [k]: v });

  return (
    <div>
      <InfoBox type="info" title="Data Collection Templates — How Planners Interact With OneStream">
        Templates are the front-end of the planning process. They can be native OneStream grids (configured in the platform) or Excel workbooks using the OneStream Excel Add-in. Both approaches write data directly into OneStream when submitted. <strong>Template design is the single biggest driver of user adoption</strong> — a template that matches how planners already think drives quick adoption. A template that forces them to learn a new mental model causes resistance and pushback.
      </InfoBox>

      <div className="form-card">
        <div className="form-card-title"><i className="ti ti-template" />Data Collection Templates</div>
        <ColumnGuide columns={TMPL_GUIDE} />
        <TblInput cols={COLS} rows={d.templates || []} onChange={(r) => f('templates', r)} addLabel="Add template" csvFilename="data-templates" />
      </div>

      <InfoBox type="tip" title="Template Design Principles — Learned from 200+ Planning Implementations">
        <strong>1. Match existing Excel habits.</strong> If planners currently use a model with accounts on rows and months on columns, replicate that layout. Changing the process AND the tool at the same time doubles resistance.<br /><br />
        <strong>2. One focused template per input area.</strong> P&amp;L input, Headcount input, CapEx input — separate templates. Mega-templates with 30+ tabs load slowly, are hard to navigate, and train users that OneStream is "too complex."<br /><br />
        <strong>3. Always seed from Actuals or Prior Budget.</strong> A blank template is demoralizing. A template pre-populated with "Actuals × 103% growth" as a starting point is immediately actionable. Seeding is one of OneStream's most underutilized features.<br /><br />
        <strong>4. Lock the formatting, not the process.</strong> Use input ranges (only the cells planners should edit are unlocked) to prevent accidental formula overwrites. This is especially important for Excel-based templates.
      </InfoBox>

      <InfoBox type="warning" title="Input Level and Template Performance">
        Templates that require input at Entity + UD1 + UD2 level create a massive number of potential input cells. For a company with 50 entities, 200 cost centers, and 50 products, a P&amp;L template at this level has 500,000 rows × 12 months = 6 million potential cells per account. Even with sparse data, this creates performance issues in both the template loading and in subsequent reporting queries.<br /><br />
        Start with Entity-only input templates and add UD dimensions only for accounts where the business process genuinely requires that level of detail. Revenue templates might need Entity + Product. OpEx templates need Entity + Cost Center. CapEx templates need Entity + Project. But you don't need all three dimensions on every template.
      </InfoBox>
    </div>
  );
}
