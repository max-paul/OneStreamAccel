import InfoBox from '../InfoBox';
import TblInput from '../TblInput';
import ColumnGuide from '../ColumnGuide';

const COLS = [
  { key: 'name',        label: 'Member Name',        ph: 'e.g. OPEN_BAL' },
  { key: 'displayName', label: 'Display Name',        ph: 'e.g. Opening Balance' },
  { key: 'type',        label: 'Member Type',         type: 'select', options: ['Balance','Flow','Calculated'] },
  { key: 'translation', label: 'Translation Method',  type: 'select', options: ['Period End (Closing Rate)','Average Rate','Historical Rate','Opening Rate','No Translation'] },
  { key: 'desc',        label: 'Notes',               ph: 'Optional — describe what movements this captures' },
];

const FLOW_GUIDE = [
  {
    col: 'Member Name',
    desc: 'Technical identifier for this flow member. No spaces. Used in business rules, report formulas, and transformation rules. Keep concise: OPEN_BAL, ACQUISITIONS, DISPOSALS, FX_MOVE, CLOSE_BAL.',
  },
  {
    col: 'Display Name',
    desc: 'User-facing label shown in reports and data entry templates. Can be more descriptive: "Opening Balance", "Acquisitions / Additions", "FX Translation Movement", "Closing Balance".',
  },
  {
    col: 'Member Type',
    desc: 'Controls how this flow member is treated in calculations and period-end processing.',
    options: [
      { val: 'Balance',    meaning: 'Point-in-time balance at a specific moment. Used for Opening Balance (period start) and Closing Balance (period end). These members hold the stock value, not the change.' },
      { val: 'Flow',       meaning: 'Movement / change during the period. Used for all activity members: additions, disposals, reclassifications, FX movements, adjustments. These members hold the flow value (delta), not the stock.' },
      { val: 'Calculated', meaning: 'Derived automatically from other flow members. Closing Balance is often Calculated as: Opening Balance + sum of all Flow members. Reduces manual data entry and ensures mathematical consistency.' },
    ],
  },
  {
    col: 'Translation Method',
    desc: 'How this flow member is translated in FX consolidations. Critical to get right — wrong translation rates cause FX differences to appear in incorrect places in the roll-forward.',
    options: [
      { val: 'Period End (Closing Rate)', meaning: 'Translated at the closing exchange rate of the current period. Used for Closing Balance and period-end snapshot members.' },
      { val: 'Average Rate',              meaning: 'Translated at the average exchange rate for the period. Used for movement members (additions, disposals, depreciation) that occurred throughout the period.' },
      { val: 'Historical Rate',           meaning: 'Translated at the rate in effect when the original transaction occurred. Used for Opening Balance (which preserves the prior period closing rate).' },
      { val: 'Opening Rate',              meaning: 'Translated at the opening exchange rate (prior period closing rate). Standard for Opening Balance members to ensure roll-forward consistency.' },
      { val: 'No Translation',            meaning: 'Not translated — only used for the FX Movement member itself, which is calculated as the translation difference. Prevents circular translation.' },
    ],
  },
  {
    col: 'Notes',
    desc: 'Document what types of transactions or movements this flow member captures. Useful for data mapping and for training teams on what to load where.',
  },
];

const DEFAULT_ROWS = [
  { name: 'OPEN_BAL',    displayName: 'Opening Balance',       type: 'Balance',    translation: 'Opening Rate',              desc: 'Balance at start of period — equals prior period closing balance' },
  { name: 'ACQUISITIONS',displayName: 'Acquisitions / Additions',type: 'Flow',    translation: 'Average Rate',              desc: 'New assets purchased, investments made, or new debt drawn down' },
  { name: 'DISPOSALS',   displayName: 'Disposals / Reductions', type: 'Flow',     translation: 'Average Rate',              desc: 'Assets sold, investments disposed of, or debt repaid' },
  { name: 'FX_MOVEMENT', displayName: 'FX Translation Movement',type: 'Flow',     translation: 'No Translation',            desc: 'FX retranslation difference — calculated automatically during consolidation' },
  { name: 'OTHER_MOVES', displayName: 'Other Movements',        type: 'Flow',     translation: 'Average Rate',              desc: 'Reclassifications, adjustments, and other movements not covered above' },
  { name: 'CLOSE_BAL',   displayName: 'Closing Balance',        type: 'Calculated',translation: 'Period End (Closing Rate)', desc: 'Calculated: Opening + all movement members' },
];

export default function StepFlowDim({ data, onChange }) {
  const d = data || {};
  const f = (k, v) => onChange({ ...d, [k]: v });

  return (
    <div>
      <InfoBox type="info" title="Flow Dimension — Making Balance Sheet Movements Transparent">
        Without the Flow dimension, your Balance Sheet shows a single number per period with no explanation of what drove the change. With Flow, every balance sheet movement is visible: what was acquired, what was disposed of, how much was currency impact, what was reclassified. This is the difference between a consolidation system that satisfies auditors and one that creates endless questions. <strong>Flow is applied to Balance Sheet accounts only — never to P&amp;L accounts.</strong>
      </InfoBox>

      <div className="form-card">
        <div className="form-card-title"><i className="ti ti-arrows-exchange" />Flow Members</div>
        <ColumnGuide columns={FLOW_GUIDE} />
        <TblInput cols={COLS} rows={d.flows || DEFAULT_ROWS} onChange={(r) => f('flows', r)} addLabel="Add flow member" />
      </div>

      <InfoBox type="tip" title="Tier Your Flow Structure to Scope">
        Start with what you need; expand in Phase 2 once the process is established:<br /><br />
        <strong>Minimum (3 members) — any consolidation:</strong><br />
        OPEN_BAL → MOVEMENTS (single combined) → CLOSE_BAL<br /><br />
        <strong>Standard (5–6 members) — recommended for most clients:</strong><br />
        OPEN_BAL → ACQUISITIONS → DISPOSALS → FX_MOVEMENT → OTHER_MOVES → CLOSE_BAL<br /><br />
        <strong>Full fixed asset / debt roll-forward (8–12 members):</strong><br />
        OPEN_BAL → ADDITIONS → DISPOSALS_COST → RECLASSIFICATIONS → DEPRECIATION_CHARGE → IMPAIRMENT → DISPOSALS_DEPR → FX_MOVEMENT → CLOSE_BAL<br /><br />
        The pre-loaded default above is the <strong>Standard (5–6 member)</strong> structure — appropriate for most Phase 1 implementations.
      </InfoBox>

      <InfoBox type="warning" title="FX Movement Member — Never Translate It">
        The <code>FX_MOVEMENT</code> (or equivalent) flow member is <strong>calculated automatically by the consolidation engine</strong> as the FX translation difference between the opening and closing exchange rates applied to the balance. It must have Translation Method = <strong>No Translation</strong> to prevent a circular calculation where you're translating the translation difference itself. Getting this wrong creates phantom FX differences in your BS roll-forward that are impossible to reconcile.
      </InfoBox>
    </div>
  );
}
