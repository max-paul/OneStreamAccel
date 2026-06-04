import InfoBox from '../InfoBox';
import TblInput from '../TblInput';
import ColumnGuide from '../ColumnGuide';

const ENTITY_COLS = [
  { key: 'entityId',     label: 'Member Name',    ph: 'e.g. US_OPCO' },
  { key: 'name',         label: 'Display Name',   ph: 'e.g. US Operations LLC' },
  { key: 'parent',       label: 'Parent',          ph: 'e.g. AMERICAS_HOLD' },
  { key: 'currency',     label: 'Local Currency',  ph: 'e.g. USD' },
  { key: 'type',         label: 'Entity Type',     type: 'select', options: ['Base','Parent','ICP','Elimination','Intercompany'] },
  { key: 'consol',       label: 'Consol Method',   type: 'select', options: ['Owned','Equity','Proportional','None'] },
  { key: 'holdingPct',   label: 'Ownership %',     ph: '100' },
  { key: 'inputAllowed', label: 'Allow Input',     type: 'select', options: ['Yes','No'] },
];

const ENTITY_GUIDE = [
  {
    col: 'Member Name',
    desc: 'The technical identifier used in business rules, security assignments, workflow configurations, and all system logs. No spaces — use underscores. Keep it concise but meaningful. This is permanent once entities have data loaded against them.',
  },
  {
    col: 'Display Name',
    desc: 'The full, human-readable entity name shown in dashboards, reports, and user-facing dropdowns. Can include spaces, legal suffixes (LLC, Ltd, GmbH), and special characters.',
  },
  {
    col: 'Parent',
    desc: 'The immediate parent entity in the consolidation hierarchy. Must exactly match the Member Name of an existing entity OR the Top-Level Entity defined above. The hierarchy is built from these parent-child relationships — every entity except the top entity must have a parent.',
  },
  {
    col: 'Local Currency',
    desc: 'The functional currency for this entity — the primary currency in which it conducts business and maintains its books. All data entered for this entity is assumed to be in this currency. Must match an ISO currency code defined in the Currency Setup step.',
  },
  {
    col: 'Entity Type',
    desc: 'Controls how this entity participates in consolidation and data management.',
    options: [
      { val: 'Base',          meaning: 'Leaf-level entity — holds actual source data. Base entities are where data is loaded from ERPs and where planners enter budget/forecast values. No child entities.' },
      { val: 'Parent',        meaning: 'Consolidation node — aggregates data from child entities. Cannot hold direct input data (input disabled). Created automatically when you define child entities with this entity as their parent.' },
      { val: 'ICP',           meaning: 'Intercompany Partner entity. Mirrors a Base entity and is used to track which specific counterparty an intercompany transaction is with. Name typically matches the Base entity with an ICP_ prefix.' },
      { val: 'Elimination',   meaning: 'Houses intercompany elimination journal entries that net out IC balances at a consolidation node. Required for each parent where IC transactions occur. Name typically: ELIM_[REGION] or E_[PARENT_NAME].' },
      { val: 'Intercompany',  meaning: 'Marks an entity as participating in intercompany transactions. Used in some implementations as a flag rather than a structural type.' },
    ],
  },
  {
    col: 'Consol Method',
    desc: 'The consolidation treatment applied to this entity\'s data when it rolls up to its parent.',
    options: [
      { val: 'Owned',         meaning: 'Full consolidation at 100%. All P&L and Balance Sheet items are included in full. Minority interest calculated separately if ownership < 100%.' },
      { val: 'Equity',        meaning: 'Equity method. Only the net investment value appears on the consolidated Balance Sheet. No revenue or expense consolidation. Typical for 20–50% ownership.' },
      { val: 'Proportional',  meaning: 'Pro-rata consolidation at the ownership percentage. Each line item is included proportionally. Used for joint ventures under US GAAP.' },
      { val: 'None',          meaning: 'No consolidation. Entity appears in hierarchy but data does not roll up. Use for dormant companies, entities outside scope, or informational nodes.' },
    ],
  },
  {
    col: 'Ownership %',
    desc: 'The parent\'s percentage ownership of this entity (0–100). Used for minority interest calculation in Owned method, and for proportional allocation in Proportional method. Enter 100 for wholly-owned subsidiaries.',
  },
  {
    col: 'Allow Input',
    desc: 'Whether users can enter data directly to this entity. Set to Yes for Base entities. Set to No for Parent and Elimination entities — they should only contain data aggregated from children or system-generated elimination entries.',
  },
];

const Req = () => <span className="req">*</span>;

export default function StepEntity({ data, onChange }) {
  const d = data || {};
  const f = (k, v) => onChange({ ...d, [k]: v });

  return (
    <div>
      <InfoBox type="info" title="Entity Hierarchy — Your Organizational Consolidation Structure">
        The Entity dimension defines every reporting unit in your group — legal entities, business units, geographic regions, or departments. OneStream builds a parent-child tree that drives consolidation roll-ups from the bottom up. <strong>Think of it as your group structure chart translated into a data hierarchy.</strong> Design this with both your legal consolidation requirements AND your management reporting requirements in mind from day one.
      </InfoBox>

      {/* Hierarchy Root */}
      <div className="form-card">
        <div className="form-card-title"><i className="ti ti-sitemap" />Hierarchy Root</div>
        <div className="form-group" style={{ maxWidth: '440px' }}>
          <label>Top-level consolidation entity <Req /></label>
          <input
            type="text"
            value={d.topEntity || ''}
            placeholder="e.g. TOTAL_GROUP or ACME_CORP"
            onChange={(e) => f('topEntity', e.target.value)}
          />
          <div className="field-hint">This is the root entity at the very top of your consolidation hierarchy — the entity that represents "100% of the group." Everything rolls into this entity. Use the group holding company's name or abbreviation. This entity is always Type = Parent, Consol Method = Owned, Input = No.</div>
        </div>
      </div>

      {/* Entity Members */}
      <div className="form-card">
        <div className="form-card-title"><i className="ti ti-list" />Entity Members</div>
        <ColumnGuide columns={ENTITY_GUIDE} />
        <TblInput cols={ENTITY_COLS} rows={d.entities || []} onChange={(r) => f('entities', r)} addLabel="Add entity" csvFilename="entities" />
      </div>

      <InfoBox type="critical" title="Elimination Entities — Non-Negotiable for Accurate Consolidation">
        For <strong>every consolidation node</strong> where intercompany transactions occur between entities, you need a dedicated <strong>Elimination entity</strong>. Without it, intercompany sales, loans, dividends, and balances will not cancel out, causing your consolidated P&amp;L and Balance Sheet to be materially overstated.<br /><br />
        <strong>Naming convention:</strong> <code>ELIM_AMERICAS</code>, <code>ELIM_EMEA</code>, <code>E_ACME_CORP</code><br />
        <strong>Entity Type:</strong> Elimination &nbsp;|&nbsp; <strong>Consol Method:</strong> Owned &nbsp;|&nbsp; <strong>Allow Input:</strong> No<br /><br />
        Elimination entities are populated automatically by OneStream's consolidation engine based on ICP entries — you do not manually enter data to them.
      </InfoBox>

      <InfoBox type="warning" title="ICP Entities Must Mirror Base Entities Exactly">
        For intercompany partner (ICP) tracking to work correctly, you need ICP entities that correspond 1:1 with every base entity that conducts intercompany business. If <code>US_OPCO</code> sells to <code>UK_OPCO</code>, you need ICP entities named something like <code>ICP_US_OPCO</code> and <code>ICP_UK_OPCO</code>. The ICP entity structure must be maintained in sync with the base entity structure — when you add a new base entity, add the corresponding ICP entity at the same time.
      </InfoBox>

      <InfoBox type="tip" title="Alternate Rollups — Legal vs. Management Reporting">
        OneStream supports <strong>multiple hierarchies</strong> within the Entity dimension through Alternate Rollups. This means the same base entities (legal entities) can roll up in a legal structure <em>and</em> a management structure simultaneously — without duplicating data. For example, <code>US_RETAIL_OPCO</code> might roll into <code>USA_LEGAL_GROUP</code> in the statutory view and into <code>RETAIL_SEGMENT_GLOBAL</code> in the management view. Design both hierarchies now, even if the management rollup is Phase 2.
      </InfoBox>
    </div>
  );
}
