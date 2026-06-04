import InfoBox from '../InfoBox';
import TblInput from '../TblInput';
import ColumnGuide from '../ColumnGuide';

const COLS = [
  { key: 'name',       label: 'Group Name',              ph: 'e.g. GRP_CORP_FINANCE' },
  { key: 'type',       label: 'Access Level',             type: 'select', options: ['System Administrator','Application Administrator','Power User / Configurator','Process Owner','Standard User','Data Entry Only','Read Only / Executive','External Auditor'] },
  { key: 'adminLevel', label: 'Admin Rights',             type: 'select', options: ['None','Application Admin','Full System Admin'] },
  { key: 'desc',       label: 'Membership / Description', ph: 'e.g. Corporate Finance team — CFO, 4 controllers. Full read/write across all entities.' },
];

const UG_GUIDE = [
  {
    col: 'Group Name',
    desc: 'A unique technical name for the group. Convention: GRP_[ROLE_DESCRIPTION]. Examples: GRP_SYS_ADMIN, GRP_CORP_FINANCE, GRP_ENTITY_FINANCE, GRP_READ_ONLY. The GRP_ prefix makes groups easy to identify in security assignments and audit reports. Avoid names that reference specific individuals — groups outlive people.',
  },
  {
    col: 'Access Level',
    desc: 'The broad functional role of this group in the organization.',
    options: [
      { val: 'System Administrator',      meaning: 'Full unrestricted access to everything: cubes, rules, data, user management, system configuration. Can delete cubes, modify consolidation engines, export all data, impersonate any user. Maximum 2–3 people. IT administrators only. NEVER assign to finance users.' },
      { val: 'Application Administrator', meaning: 'Can configure application metadata (accounts, entities, rules, reports) but cannot access system-level settings (server configuration, user management, license management). Appropriate for the finance IT team who maintain the application day-to-day.' },
      { val: 'Power User / Configurator', meaning: 'Experienced finance user who can modify reports, dashboards, and some application settings. Cannot modify core metadata (COA, entity hierarchy) or business rules. Good for report power users and dashboard builders.' },
      { val: 'Process Owner',             meaning: 'Senior finance user responsible for the close or planning process. Can override workflow steps, run consolidation, and access all entities\' data. Typically the Group Controller, FP&A Director, or CFO.' },
      { val: 'Standard User',             meaning: 'Regular finance user who can enter data for their assigned entities, run reports, and participate in workflow. The most common user type. 60–70% of OneStream users fall into this category.' },
      { val: 'Data Entry Only',           meaning: 'Can only enter data in assigned templates. Cannot run reports beyond basic dashboards. Cannot modify workflow status. Suitable for subsidiary controllers who only submit data.' },
      { val: 'Read Only / Executive',     meaning: 'View-only access to reports, dashboards, and data. Cannot enter data or modify anything. Appropriate for senior management, board members, investors, and executive leadership.' },
      { val: 'External Auditor',          meaning: 'Read-only access specifically scoped for audit purposes. Typically limited to current and prior audit year. Access is time-limited and should be revoked at audit completion.' },
    ],
  },
  {
    col: 'Admin Rights',
    desc: 'Specific OneStream platform administration capabilities for this group.',
    options: [
      { val: 'None',                 meaning: 'No administrative capabilities. User can only access features explicitly granted via role assignments. Correct for all finance users and executives.' },
      { val: 'Application Admin',    meaning: 'Can modify application configuration: accounts, entities, rules, workflows, reports. Cannot access platform-level settings (servers, users, licenses). Appropriate for the finance IT / configurator team.' },
      { val: 'Full System Admin',    meaning: 'Complete platform access with no restrictions. Can access server settings, manage all users, modify any configuration, and access all data regardless of cube security. MUST be restricted to 2–3 named IT administrators only.' },
    ],
  },
  {
    col: 'Membership / Description',
    desc: 'Document who is in this group (job titles, team name, approximate count), what they are responsible for, and any special access considerations. This becomes the reference documentation for user access reviews — which external auditors will request annually.',
  },
];

const DEFAULT_ROWS = [
  { name: 'GRP_SYS_ADMIN',      type: 'System Administrator',      adminLevel: 'Full System Admin',   desc: 'IT Platform Administrators — 2–3 named individuals only. IT Finance or IT Infrastructure team.' },
  { name: 'GRP_CONFIGURATOR',   type: 'Application Administrator',  adminLevel: 'Application Admin',   desc: 'Finance Systems team — configure metadata, rules, reports. Typically 3–5 people in Finance IT.' },
  { name: 'GRP_CORP_FINANCE',   type: 'Process Owner',              adminLevel: 'None',                desc: 'Group Corporate Finance — CFO, Group Controller, FP&A Director. Full read/write, all entities.' },
  { name: 'GRP_ENTITY_FINANCE', type: 'Standard User',              adminLevel: 'None',                desc: 'Entity-level Finance teams — data entry and submission for assigned entities only.' },
  { name: 'GRP_READ_ONLY',      type: 'Read Only / Executive',      adminLevel: 'None',                desc: 'Senior Management, Board Members, Investors. Read-only dashboards and reports.' },
];

export default function StepUserGroups({ data, onChange }) {
  const d = data || {};
  const f = (k, v) => onChange({ ...d, [k]: v });

  return (
    <div>
      <InfoBox type="info" title="User Groups — The Foundation of OneStream's Security Model">
        OneStream's security architecture is entirely group-based. <strong>All permissions are assigned to groups — never to individual users.</strong> Individual users inherit everything from their group. This means: adding a new user is trivial (add them to the right group), removing access is instant (remove from group), and access reviews are manageable (review group memberships, not 200 individual user settings). This model scales from 10 users to 10,000 users without redesign.
      </InfoBox>

      <div className="form-card">
        <div className="form-card-title"><i className="ti ti-users-group" />User Groups</div>
        <ColumnGuide columns={UG_GUIDE} />
        <TblInput cols={COLS} rows={d.groups || DEFAULT_ROWS} onChange={(r) => f('groups', r)} addLabel="Add user group" />
      </div>

      <InfoBox type="critical" title="System Administrator — The Most Dangerous Role in OneStream">
        A OneStream System Administrator can:<br />
        • Delete any cube and all its data permanently with no confirmation<br />
        • Modify consolidation engine rules and override approved results<br />
        • Export the complete contents of every cube including confidential data<br />
        • Impersonate any user in the system<br />
        • Modify or delete any user account including other admins<br />
        • Bypass all workflow locks and security restrictions<br /><br />
        <strong>This must be restricted to 2–3 named IT staff maximum.</strong> If a finance director asks for System Admin access "just to run reports faster," the answer is no. This is documented as a key control in SOX ITGC (IT General Controls) assessments. A finding that non-IT users have System Admin access is a material weakness.
      </InfoBox>

      <InfoBox type="tip" title="Design for User Access Reviews — Not Just Go-Live">
        External auditors conduct User Access Reviews (UAR) at least annually — and more frequently for high-risk systems like consolidation platforms. Design your group structure to make these reviews easy:<br />
        1. <strong>Groups should map to job functions</strong>, not individuals. "Corporate Finance Team" is a good group name. "John Smith's Access" is not.<br />
        2. <strong>Document the access justification</strong> in the group description — auditors will ask why each group needs each permission.<br />
        3. <strong>Create an "External Auditor" group</strong> with time-limited read access so auditors don't need IT involvement for every evidence request.<br />
        4. <strong>Run the User Access Report</strong> in OneStream every quarter and have the Group Controller sign it off — this is your UAR control evidence.
      </InfoBox>
    </div>
  );
}
