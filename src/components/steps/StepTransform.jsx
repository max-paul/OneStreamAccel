import InfoBox from '../InfoBox';
import TblInput from '../TblInput';
import ColumnGuide from '../ColumnGuide';

const TARGET_DIMS = ['Account','Entity','Scenario','Time','Flow','UD1','UD2','UD3','UD4','UD5','ICP','Amount','Currency','Description'];

const COLS = [
  { key: 'source',      label: 'Source Field',         ph: 'e.g. GL_ACCOUNT_CODE' },
  { key: 'target',      label: 'Target Dimension',      type: 'select', options: TARGET_DIMS },
  { key: 'method',      label: 'Method',                type: 'select', options: ['Direct (1:1)','Lookup Table','Calculated / Formula','Default (fixed value)','Substitution / Find-Replace','Ignore / Discard'] },
  { key: 'sampleSource',label: 'Example Source Value',  ph: 'e.g. 410000' },
  { key: 'sampleTarget',label: 'Example Target Value',  ph: 'e.g. REV_PRODUCT_SALES' },
  { key: 'notes',       label: 'Notes / Exceptions',    ph: 'e.g. SAP cost element 410000 maps to product revenue' },
];

const TR_GUIDE = [
  {
    col: 'Source Field',
    desc: 'The exact field name from the source system extract. Must match the column header in your data extract file or the SELECT column alias from your SQL query. Examples: GL_ACCOUNT, COST_CENTER_CODE, COMPANY_CODE, POSTING_DATE, AMOUNT_LC.',
  },
  {
    col: 'Target Dimension',
    desc: 'Which OneStream dimension this source field maps to. Every dimension in the target cube must have at least one transformation rule. Common mappings: GL_ACCOUNT → Account, COST_CENTER → UD1, COMPANY_CODE → Entity, PERIOD → Time, CURRENCY → Currency, AMOUNT → Amount.',
  },
  {
    col: 'Method',
    desc: 'The logic used to transform the source value into the target OneStream member.',
    options: [
      { val: 'Direct (1:1)',              meaning: 'The source value IS the OneStream member name — no transformation needed. Only works when source system codes exactly match OneStream member names. Rare in practice.' },
      { val: 'Lookup Table',             meaning: 'MOST COMMON METHOD. Build a mapping table: source value → target member. Supports wildcards (e.g., 41* → REV_PRODUCT), ranges (1000–1999 → AST_CURRENT), and a catch-all default row.' },
      { val: 'Calculated / Formula',     meaning: 'A VB.NET or C# expression derives the target value. Used for complex derivations: concatenating fields, conditional logic, cross-field lookups. Examples: derive Entity from Company + Division codes combined.' },
      { val: 'Default (fixed value)',    meaning: 'All records map to the same single target value regardless of source. Use for Scenario (all actuals load to "Actual"), Flow (all load to "MOVEMENTS"), or any dimension where every source record targets the same member.' },
      { val: 'Substitution / Find-Replace', meaning: 'Simple find-and-replace within the source value. Example: replace "CC_" prefix with "" to convert "CC_1234" to "1234". Less powerful than Lookup Table but faster to configure for simple string transformations.' },
      { val: 'Ignore / Discard',         meaning: 'This field is not loaded into any OneStream dimension — it is ignored. Use for source fields that exist in the extract but are not needed in OneStream (e.g., internal system codes, journal entry line descriptions you don\'t want to load).' },
    ],
  },
  {
    col: 'Example Source Value',
    desc: 'A real sample value from the source system extract. Used for documentation and for testing your mapping. This makes it easy for the team to verify the mapping during UAT without needing to access the source system.',
  },
  {
    col: 'Example Target Value',
    desc: 'The OneStream member that the example source value should map to. Used for documentation and testing verification. Cross-check against your Account/Entity/UD member lists.',
  },
  {
    col: 'Notes / Exceptions',
    desc: 'Document the business logic behind this mapping, any exceptions to the general rule, known edge cases, and any accounts that require special handling. This is your data mapping specification — it should be complete enough for an auditor to verify.',
  },
];

export default function StepTransform({ data, onChange }) {
  const d = data || {};
  const f = (k, v) => onChange({ ...d, [k]: v });

  return (
    <div>
      <InfoBox type="info" title="Transformation Rules — The Bridge Between Source Data and OneStream">
        Transformation rules are where the magic (and the most common failures) happen in data integration. They translate your source system's data structure into OneStream's dimensional model. <strong>Every dimension in the target cube must have a transformation rule</strong> — there is no implicit default. A single source record with an unmapped value for any required dimension will fail to load entirely, not partially.
      </InfoBox>

      <div className="form-card">
        <div className="form-card-title"><i className="ti ti-transform" />Transformation Rules</div>
        <ColumnGuide columns={TR_GUIDE} />
        <TblInput cols={COLS} rows={d.transforms || []} onChange={(r) => f('transforms', r)} addLabel="Add transformation rule" csvFilename="transformation-rules" />
      </div>

      <InfoBox type="warning" title="The Catch-All Rule — Non-Negotiable for Production Quality">
        For every dimension using the Lookup Table method, you <strong>must</strong> add a final catch-all rule at the bottom of the mapping table. This catch-all should:<br />
        1. Match <strong>any value</strong> not caught by prior rules (wildcard: * or blank source)<br />
        2. Map to a dedicated <strong>error member</strong> (e.g., <code>UNMAPPED_ACCOUNT</code>, <code>UNMAPPED_ENTITY</code>)<br />
        3. The error member should be visible in your exception reports<br /><br />
        Without a catch-all, source records with unrecognized values fail silently — they don't load and nobody knows. <strong>Silent data loss is the most dangerous failure mode in financial data integration</strong>. Build your catch-all from day one, monitor the error member in every post-load report, and process exceptions before signing off on close.
      </InfoBox>

      <InfoBox type="tip" title="Account Mapping Strategy — From Legacy COA to OneStream">
        For migrations from HFM, BPC, Hyperion Planning, or GL systems, the account transformation mapping is typically the most complex workstream. Best practice approach:<br /><br />
        1. Export a complete list of unique source account codes with their descriptions and posting frequencies<br />
        2. Have the Controller team review and map each to an OneStream Account member in a spreadsheet first<br />
        3. Convert the approved spreadsheet into the Lookup Table rules<br />
        4. Run a reconciliation: source extract total = sum of all loaded amounts (before any eliminations)<br /><br />
        Build in 2–3 weeks for account mapping in any migration with more than 500 source GL accounts. It always takes longer than expected.
      </InfoBox>
    </div>
  );
}
