import InfoBox from '../InfoBox';
import TblInput from '../TblInput';
import ColumnGuide from '../ColumnGuide';

const DIMS = ['Account','Entity','Scenario','Time','Flow','Consolidation Method','UD1','UD2','UD3','UD4','UD5','UD6','UD7','UD8','ICP'];

const COLS = [
  { key: 'cube',          label: 'Cube',             ph: 'e.g. CONSOL' },
  { key: 'dim',           label: 'Dimension',         type: 'select', options: DIMS },
  { key: 'required',      label: 'Required',          type: 'select', options: ['Yes','No'] },
  { key: 'topMember',     label: 'Top Member',         ph: 'e.g. TOTAL_ACCOUNTS' },
  { key: 'defaultMember', label: 'Default Member',     ph: 'e.g. TOTAL_COST_CENTERS' },
  { key: 'notes',         label: 'Notes',              ph: 'Optional' },
];

const DIM_GUIDE = [
  {
    col: 'Cube',
    desc: 'The Cube ID (from Cube Properties) that this binding applies to. Each row binds one dimension to one cube. A cube with 10 dimensions will have 10 rows in this table.',
  },
  {
    col: 'Dimension',
    desc: 'The OneStream dimension to bind to this cube. Account, Entity, Scenario, Time, and Consolidation Method are required for all Consolidation cubes. Flow is recommended for Consolidation cubes. ICP only if intercompany elimination is needed. UDs as configured in the UD Dimensions step.',
  },
  {
    col: 'Required',
    desc: 'Whether every data intersection must specify a member for this dimension.',
    options: [
      { val: 'Yes', meaning: 'Data cannot be entered or retrieved without specifying a member of this dimension. A data load record with no value for a Required dimension will fail. Use for core financial dimensions: Account, Entity, Scenario, Time.' },
      { val: 'No',  meaning: 'If no member is specified, the Default Member is used automatically. This makes data entry simpler for dimensions that are not always relevant (e.g., Cost Center — if a P&L entry doesn\'t relate to a specific cost center, it uses the Total member as default). Recommended for all UD dimensions.' },
    ],
  },
  {
    col: 'Top Member',
    desc: 'The root member of this dimension\'s hierarchy as used in this cube. All other members roll up to this member. When you query the cube at the top level of a dimension, this is what you get. For Account: TOTAL_FINANCIAL_POSITION. For Entity: the top consolidation entity name. For Scenario: typically "All Scenarios" or just the individual scenarios.',
  },
  {
    col: 'Default Member',
    desc: 'For Required = No dimensions only. The member automatically used when no member is specified. Must be an existing member — typically the Top Member (total) of that dimension. Example: if Cost Center (UD1) is optional and the default is TOTAL_COST_CENTERS, any data entered without a specific cost center goes to the total bucket.',
  },
  {
    col: 'Notes',
    desc: 'Document any special binding behavior, exceptions, or configuration notes for this cube-dimension combination.',
  },
];

export default function StepCubeDims({ data, onChange }) {
  const d = data || {};
  const f = (k, v) => onChange({ ...d, [k]: v });

  return (
    <div>
      <InfoBox type="info" title="Cube Dimension Bindings — What Each Cube Can Store">
        Dimension bindings define the analytical structure of each cube — which dimensions are available for querying and data entry, which are mandatory, and what the default values are. Think of it as defining the "axes" of each cube. A Consolidation cube typically needs all core financial dimensions. A Planning cube might exclude Flow and ICP to simplify input. A Statistical cube might exclude Flow entirely.
      </InfoBox>

      <div className="form-card">
        <div className="form-card-title"><i className="ti ti-grid-dots" />Cube Dimension Bindings</div>
        <ColumnGuide columns={DIM_GUIDE} />
        <TblInput cols={COLS} rows={d.cubeDims || []} onChange={(r) => f('cubeDims', r)} addLabel="Add binding" csvFilename="cube-dimensions" />
      </div>

      <InfoBox type="tip" title="Standard Binding Sets for Common Cube Types">
        <strong>Consolidation Cube — Required bindings:</strong><br />
        Account (Required), Entity (Required), Scenario (Required), Time (Required), Consolidation Method (Required), Flow (Required for BS accounts)<br />
        + ICP (Required, if ICP enabled on cube) + UD1–UD3 (No/optional) + UD4–UD8 (No, Total default member)<br /><br />
        <strong>Planning Cube — Recommended bindings:</strong><br />
        Account (Required), Entity (Required), Scenario (Required), Time (Required)<br />
        + UD1 Cost Center (No, optional), UD2 Product (No, optional) — NO Flow, NO ICP, NO Consolidation Method<br /><br />
        <strong>Statistical Cube:</strong><br />
        Account (Required), Entity (Required), Scenario (Required), Time (Required) + relevant UDs — NO Flow, NO ICP, NO Consolidation Method
      </InfoBox>

      <InfoBox type="warning" title="Consolidation Method Dimension — Required for Consolidation Cubes">
        The Consolidation Method dimension is often forgotten by new OneStream configurators. <strong>It must be bound to every Consolidation cube</strong>. It contains members like: <code>Proportion</code> (entity's contribution at ownership %), <code>Elimination</code> (IC elimination journals), <code>Contribution</code> (parent entity aggregation), and <code>Entity</code> (entity's own data before consolidation adjustments). Without this dimension, consolidation calculations cannot separate owned data from elimination data — your consolidated results will be incorrect.
      </InfoBox>
    </div>
  );
}
