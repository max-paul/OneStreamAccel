import InfoBox from '../InfoBox';
import TblInput from '../TblInput';
import ColumnGuide from '../ColumnGuide';

const COLS = [
  { key: 'ud',        label: 'Dimension',       type: 'select', options: ['UD1','UD2','UD3','UD4','UD5','UD6','UD7','UD8'] },
  { key: 'name',      label: 'Business Name',   ph: 'e.g. Cost Center' },
  { key: 'topMember', label: 'Top Member Name', ph: 'e.g. TOTAL_COST_CENTERS' },
  { key: 'purpose',   label: 'Business Purpose', ph: 'e.g. Department-level P&L reporting by cost center owner' },
  { key: 'dataEntry', label: 'Required for Input', type: 'select', options: ['Yes — planners must specify','No — optional (uses total member)'] },
  { key: 'enabled',   label: 'Status',           type: 'select', options: ['Enabled — Active','Reserved — Single total member only','Disabled'] },
];

const UD_GUIDE = [
  {
    col: 'Dimension',
    desc: 'Which of the 8 available UD slots to use. UD1–UD3 are most commonly active in Phase 1. UD4–UD8 are typically reserved for future requirements. The slot number itself has no functional significance — it\'s just a label. Assign them to your most important analytical dimensions first.',
  },
  {
    col: 'Business Name',
    desc: 'The meaningful business name for this dimension as it will appear to users. This replaces the generic "UD1" label in the UI. Examples: "Cost Center", "Product Line", "Project Code", "Customer Segment", "Channel". Choose names that business users will immediately understand.',
  },
  {
    col: 'Top Member Name',
    desc: 'The technical name of the root/total member at the top of this dimension\'s hierarchy. This is also the default member used when a data load or input doesn\'t specify a UD value. Convention: TOTAL_[DIMENSION_NAME] (e.g., TOTAL_COST_CENTERS, TOTAL_PRODUCTS). ALL data aggregates to this member.',
  },
  {
    col: 'Business Purpose',
    desc: 'A clear statement of what analytical question this dimension answers. Good examples: "Enables department-level P&L reporting for cost center managers", "Supports product profitability analysis across all entities", "Tracks capital project spend against approved budgets". This documentation helps future teams understand why the dimension exists.',
  },
  {
    col: 'Required for Input',
    desc: 'Whether users must specify a member from this dimension when entering data. Yes = users must select a specific member (e.g., a specific cost center) — no data can be entered without specifying this dimension. No = optional, uses the Top Member as default if not specified. Setting to No simplifies templates for users who don\'t need to split by this dimension.',
  },
  {
    col: 'Status',
    desc: 'Whether this UD slot is active, reserved, or unused.',
    options: [
      { val: 'Enabled — Active',                meaning: 'Fully active dimension with a real hierarchy of members. Every data intersection in the cube will include this dimension. Adds to cube size proportional to the number of members.' },
      { val: 'Reserved — Single total member only', meaning: 'The dimension exists in the cube but has only one member (the Total). This costs almost nothing in performance but preserves the slot for future use without a cube rebuild. Recommended for UD4–UD8.' },
      { val: 'Disabled',                        meaning: 'The dimension is not included in any cube bindings. Cannot be added later without a cube redesign. Only use Disabled if you are 100% certain this slot will never be needed.' },
    ],
  },
];

export default function StepUdDims({ data, onChange }) {
  const d = data || {};
  const f = (k, v) => onChange({ ...d, [k]: v });

  return (
    <div>
      <InfoBox type="info" title="User-Defined Dimensions — Analytical Depth Beyond Legal Structure">
        OneStream provides 8 configurable analytical dimensions (UD1–UD8) for capturing business segmentation that doesn't fit the standard financial dimensions. These are the dimensions that transform OneStream from a legal consolidation tool into a true management reporting and planning platform. Use them to answer questions like: "Which cost centers are driving the expense overrun?" or "Which product lines are profitable across all regions?"
      </InfoBox>

      <div className="form-card">
        <div className="form-card-title"><i className="ti ti-tag" />User-Defined Dimension Configuration</div>
        <ColumnGuide columns={UD_GUIDE} />
        <TblInput cols={COLS} rows={d.udDims || []} onChange={(r) => f('udDims', r)} addLabel="Add UD dimension" csvFilename="ud-dimensions" />
      </div>

      <InfoBox type="tip" title="Standard UD Assignment — Proven Across Hundreds of Implementations">
        This assignment covers 95% of enterprise implementations:<br /><br />
        <strong>UD1 — Cost Center / Department:</strong> The most universally requested UD. Enables departmental P&amp;L without separate entities. Every P&amp;L account should allow UD1 input.<br />
        <strong>UD2 — Product / Service Line:</strong> Revenue and gross margin by product family. Usually relevant for Revenue and COGS accounts only.<br />
        <strong>UD3 — Project / Program / CapEx:</strong> Project accounting and capital expenditure tracking. Relevant for specific expense accounts and asset additions.<br />
        <strong>UD4 — Customer / Channel:</strong> Only enable if you have genuine customer/channel segmentation requirements in Phase 1. Often Phase 2.<br />
        <strong>UD5–UD8 — Reserved (single Total member):</strong> Include in every cube with a single "TOTAL" member. Zero performance cost; prevents a cube rebuild if Phase 2 needs them.
      </InfoBox>

      <InfoBox type="warning" title="Cube Size Grows Multiplicatively — Plan Member Counts Carefully">
        Adding a UD dimension with 200 members multiplies every data intersection in the cube by 200. If you have 1,000 accounts × 50 entities × 3 scenarios × 12 periods × 1 flow member, that's 1.8 billion intersections before any UDs. Add UD1 (200 Cost Centers) and UD2 (50 Products): you're at 18 trillion theoretical intersections. In practice, only a fraction will have data, but this drives memory requirements, query performance, and consolidation time.<br /><br />
        <strong>Practical rule:</strong> Keep active UD member counts under 500 for UD1, under 200 for UD2–UD3. Work with the business to rationalize member lists before go-live.
      </InfoBox>
    </div>
  );
}
