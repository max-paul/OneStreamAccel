import InfoBox from '../InfoBox';
import TblInput from '../TblInput';
import ColumnGuide from '../ColumnGuide';

const COLS = [
  { key: 'name',        label: 'Profile Name',       ph: 'e.g. Monthly_Close_Actuals' },
  { key: 'frequency',   label: 'Frequency',           type: 'select', options: ['Monthly','Quarterly','Semi-Annual','Annual','Ad-hoc'] },
  { key: 'scenario',    label: 'Target Scenario',     ph: 'e.g. Actual' },
  { key: 'granularity', label: 'Granularity',         type: 'select', options: ['Entity Only','Entity + Scenario','Entity + Scenario + Cube','Custom'] },
  { key: 'steps',       label: 'Workflow Steps',      ph: 'e.g. Input → Review → Approve' },
];

const WF_GUIDE = [
  {
    col: 'Profile Name',
    desc: 'A descriptive name for this workflow process. Convention: [Frequency]_[Purpose]_[Scenario]. Examples: Monthly_Close_Actuals, Quarterly_Budget_Review, Annual_Plan_Approval. This name appears in the Workflow Status dashboard that Controllers use to monitor close progress.',
  },
  {
    col: 'Frequency',
    desc: 'How often this workflow cycle runs.',
    options: [
      { val: 'Monthly',     meaning: 'Triggers a new cycle each month — 12 cycles per fiscal year. Standard for Actual close workflow and monthly rolling forecasts.' },
      { val: 'Quarterly',   meaning: 'Triggers four times per year. Used for quarterly budget reviews, board reporting packs, or quarterly forecast updates.' },
      { val: 'Semi-Annual', meaning: 'Twice per year. Less common — used for semi-annual statutory reporting or bi-annual budget refresh cycles.' },
      { val: 'Annual',      meaning: 'Once per fiscal year. Typically for the annual operating plan (Budget) sign-off process or annual statutory consolidation.' },
      { val: 'Ad-hoc',      meaning: 'No fixed schedule — triggered manually. Use for one-off consolidation runs, restatements, or special reporting cycles.' },
    ],
  },
  {
    col: 'Target Scenario',
    desc: 'The scenario that this workflow profile governs. Must match the Scenario Member Name exactly. Each scenario you want to manage through workflow needs its own workflow profile (or multiple profiles for different entity groups within the same scenario).',
  },
  {
    col: 'Granularity',
    desc: 'The level at which individual workflow "units" are created. Each workflow unit is independently tracked, has its own status, and can be individually locked/unlocked.',
    options: [
      { val: 'Entity Only',              meaning: 'One workflow unit per entity per period. Simplest model — 50 entities = 50 units per close. Recommended for Phase 1. Easy to manage on the status dashboard.' },
      { val: 'Entity + Scenario',        meaning: 'One unit per entity-scenario combination per period. If you have 50 entities and 3 scenarios: 150 units per period. Adds complexity but enables scenario-specific sign-off.' },
      { val: 'Entity + Scenario + Cube', meaning: 'Most granular. One unit per entity-scenario-cube combination. Very high unit count. Only use if you have a genuine business requirement to sign off at this level.' },
      { val: 'Custom',                   meaning: 'Workflow unit definition is configured via business rules or specific workflow profile settings. Maximum flexibility but requires development work.' },
    ],
  },
  {
    col: 'Workflow Steps',
    desc: 'The ordered list of steps in this workflow process. Each step has a name, the action it enables (data entry, review, approval), and the user group authorized to perform it. Document as a sequence: "Step 1: Input (Entity Finance) → Step 2: Review (Regional Controller) → Step 3: Approve (Group Controller)". This maps directly to the Workflow Security configuration in Phase 6.',
  },
];

export default function StepWorkflow({ data, onChange }) {
  const d = data || {};
  const f = (k, v) => onChange({ ...d, [k]: v });

  return (
    <div>
      <InfoBox type="info" title="Workflow Profiles — Your Digital Close Management System">
        OneStream Workflow transforms the period-end close from an email chain and spreadsheet tracker into a formal, auditable process. Each entity's close status is tracked in real-time. Controllers can see at a glance which entities are open, submitted, under review, approved, or overdue. Workflow creates a complete, time-stamped audit trail of who submitted what, when, and who approved it — invaluable for auditors and SOX compliance.
      </InfoBox>

      <div className="form-card">
        <div className="form-card-title"><i className="ti ti-workflow" />Workflow Profiles</div>
        <ColumnGuide columns={WF_GUIDE} />
        <TblInput cols={COLS} rows={d.workflows || []} onChange={(r) => f('workflows', r)} addLabel="Add workflow profile" />
      </div>

      <InfoBox type="tip" title="The 3-Step Workflow Covers 90% of Use Cases">
        Fight the temptation to build a 7-step workflow with sub-steps and parallel approvals in Phase 1. The most successful OneStream implementations start with the simplest workflow that satisfies the business requirement:<br /><br />
        <strong>Step 1 — Input / Submit:</strong> Entity finance team enters data and clicks Submit. This action locks the entity (prevents further edits) and notifies the reviewer. OneStream records the submitter name and timestamp.<br />
        <strong>Step 2 — Review:</strong> Regional controller reviews completeness and accuracy. Can Approve-to-next-step (sends to Group) or Send Back (returns to entity with a comment for correction).<br />
        <strong>Step 3 — Approve:</strong> Group controller gives final sign-off. Approved status triggers consolidation or marks entity as ready for the group consolidation run.<br /><br />
        You can always add more steps in Phase 2 once the process is running smoothly.
      </InfoBox>

      <InfoBox type="warning" title="Workflow Granularity Multiplier Effect">
        Before choosing granularity, calculate your total workflow unit count for a typical close:<br />
        <strong>Entity Only:</strong> 50 entities × 12 months = 600 units/year. Manageable.<br />
        <strong>Entity + Scenario:</strong> 50 × 3 scenarios × 12 = 1,800 units/year. Getting complex.<br />
        <strong>Entity + Scenario + Cube:</strong> 50 × 3 × 2 cubes × 12 = 3,600 units/year. Very difficult to manage.<br /><br />
        The close management dashboard shows all workflow units simultaneously. A status board with 3,600 items is not useful. Design granularity for manageability, not theoretical completeness.
      </InfoBox>
    </div>
  );
}
