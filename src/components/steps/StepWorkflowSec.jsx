import InfoBox from '../InfoBox';
import TblInput from '../TblInput';
import ColumnGuide from '../ColumnGuide';

const COLS = [
  { key: 'workflow', label: 'Workflow Profile',   ph: 'e.g. Monthly_Close_Actuals' },
  { key: 'group',    label: 'User Group',          ph: 'e.g. GRP_ENTITY_FINANCE' },
  { key: 'role',     label: 'Workflow Role',       type: 'select', options: ['Owner / Process Manager','Preparer / Submitter','Reviewer','Approver','Consolidator','Read Only'] },
  { key: 'scope',    label: 'Entity Scope',         ph: 'e.g. All Base Entities, or AMERICAS_HOLD (all children)' },
];

const WFSEC_GUIDE = [
  {
    col: 'Workflow Profile',
    desc: 'The workflow profile name (from Workflow Profiles configuration) this security rule applies to. Must exactly match the Profile Name. Create separate rows for each workflow profile this group participates in.',
  },
  {
    col: 'User Group',
    desc: 'The user group receiving this workflow role assignment. Must match a Group Name from User Groups. A group can have different roles in different workflows — e.g., GRP_CORP_FINANCE might be Approver in the Monthly Close workflow but Owner in the Budget Review workflow.',
  },
  {
    col: 'Workflow Role',
    desc: 'What this group is authorized to DO in this workflow. Defines the actions available to group members on their assigned workflow units.',
    options: [
      { val: 'Owner / Process Manager', meaning: 'The most powerful workflow role. Can open, close, reset, lock, and override ANY workflow unit within their scope. Can bypass the normal approval chain. Can reopen an approved submission. Assign only to the Group Controller or equivalent. Misuse of this role is a serious audit concern.' },
      { val: 'Preparer / Submitter',    meaning: 'Can enter data, make corrections, and submit (formally close their input window). Once submitted, the workflow unit moves to the next step and the Preparer can no longer edit data. This is the primary role for entity finance teams.' },
      { val: 'Reviewer',                meaning: 'Can view data for their assigned entities and either approve-to-next-step or send-back with a comment. Cannot enter or modify data. Used for regional controllers who review multiple entity submissions before passing to Group.' },
      { val: 'Approver',                meaning: 'Final sign-off authority. Approval triggers the configured post-approval action (e.g., triggers consolidation, marks entity ready for group reporting, sends notification). The Approver is the accountable officer for the accuracy of the data.' },
      { val: 'Consolidator',            meaning: 'Can initiate consolidation calculations for the entities in their scope. Does not mean they can modify data — only trigger the calculation engine. Typically restricted to the Group Finance team or a dedicated consolidation manager.' },
      { val: 'Read Only',               meaning: 'Can view workflow status and data but cannot take any action. Useful for giving senior management visibility into close progress without the ability to accidentally change anything.' },
    ],
  },
  {
    col: 'Entity Scope',
    desc: 'Which entities this workflow role applies to. Options: "All Base Entities" (every leaf entity in the hierarchy), the name of a parent entity (automatically includes all children of that parent — e.g., AMERICAS_HOLD gives access to all Americas entities), or a specific entity name (single entity only). Define scope carefully — too broad creates risk, too narrow creates operational gaps.',
  },
];

export default function StepWorkflowSec({ data, onChange }) {
  const d = data || {};
  const f = (k, v) => onChange({ ...d, [k]: v });

  return (
    <div>
      <InfoBox type="info" title="Workflow Security — Who Controls Each Step of the Close">
        Workflow security is distinct from data security. A user might have Read/Write access to a cube (data security) but be unauthorized to approve workflow submissions (workflow security). Both controls are needed for a complete security model. Workflow security defines who can act on each workflow unit — submit, review, approve, or reset — and for which entities and scenarios.
      </InfoBox>

      <div className="form-card">
        <div className="form-card-title"><i className="ti ti-lock" />Workflow Security Rules</div>
        <ColumnGuide columns={WFSEC_GUIDE} />
        <TblInput cols={COLS} rows={d.wfSec || []} onChange={(r) => f('wfSec', r)} addLabel="Add security rule" csvFilename="workflow-security" />
      </div>

      <InfoBox type="critical" title="Segregation of Duties — This Is an Audit Control Point">
        <strong>The same person must NEVER be both Preparer and Approver for the same workflow unit.</strong> This is the most fundamental Segregation of Duties (SoD) requirement for financial close processes and is explicitly tested in SOX ITGC audits, ISAE 3402 / SOC 1 audits, and external financial audits.<br /><br />
        <strong>Compliant design:</strong><br />
        Entity Finance (GRP_ENTITY_FINANCE) → Preparer for their own entities<br />
        Regional Controller (GRP_CORP_FINANCE) → Reviewer for their region<br />
        Group Controller (separate person within GRP_CORP_FINANCE) → Approver for all<br /><br />
        <strong>Non-compliant design (will be flagged):</strong><br />
        Same group or same person assigned both Preparer AND Approver for the same entity/scenario<br /><br />
        Document your SoD design in your ICFR (Internal Controls over Financial Reporting) documentation. Auditors will request evidence that the design prevents self-approval.
      </InfoBox>

      <InfoBox type="tip" title="Workflow Role Matrix — Full Documentation">
        Create and maintain a complete Workflow Role Matrix as a formal document: rows = user groups, columns = workflow profiles, cells = workflow role. Share this with your ICFR team and internal audit before go-live. This is the primary evidence document for workflow security controls during audit.<br /><br />
        Example matrix for Monthly Close workflow:<br />
        <table style={{ fontSize: '11.5px', borderCollapse: 'collapse', marginTop: '8px', width: '100%' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', padding: '4px 8px', borderBottom: '1px solid var(--border)', color: 'var(--text2)' }}>User Group</th>
              <th style={{ textAlign: 'left', padding: '4px 8px', borderBottom: '1px solid var(--border)', color: 'var(--text2)' }}>Monthly Close</th>
              <th style={{ textAlign: 'left', padding: '4px 8px', borderBottom: '1px solid var(--border)', color: 'var(--text2)' }}>Entity Scope</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['GRP_SYS_ADMIN', 'Owner', 'All entities'],
              ['GRP_CORP_FINANCE', 'Approver + Consolidator', 'All entities'],
              ['GRP_ENTITY_FINANCE', 'Preparer / Submitter', 'Assigned entities only'],
              ['GRP_READ_ONLY', 'Read Only', 'All entities'],
            ].map(([g, r, s]) => (
              <tr key={g}>
                <td style={{ padding: '4px 8px', color: 'var(--text)', fontFamily: 'monospace', fontSize: '11px' }}>{g}</td>
                <td style={{ padding: '4px 8px', color: 'var(--text2)' }}>{r}</td>
                <td style={{ padding: '4px 8px', color: 'var(--text3)' }}>{s}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </InfoBox>
    </div>
  );
}
