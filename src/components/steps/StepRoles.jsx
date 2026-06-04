import InfoBox from '../InfoBox';
import TblInput from '../TblInput';
import ColumnGuide from '../ColumnGuide';

const COLS = [
  { key: 'group',      label: 'User Group',           ph: 'e.g. GRP_ENTITY_FINANCE' },
  { key: 'object',     label: 'Security Object Type',  type: 'select', options: ['Application','Cube','Workflow Profile','Dashboard','Report Book','Data — Entity Member','Data — Account Member','Business Rule','Connector / Data Source'] },
  { key: 'name',       label: 'Object Name',           ph: 'e.g. CONSOL (cube name) or ALL' },
  { key: 'permission', label: 'Permission Level',       type: 'select', options: ['Full Access','Read / Write','Read Only','No Access (Deny)'] },
];

const ROLES_GUIDE = [
  {
    col: 'User Group',
    desc: 'The group receiving this permission. Must exactly match a Group Name from User Groups configuration. One permission row = one group + one object combination. A group with access to multiple cubes needs multiple rows.',
  },
  {
    col: 'Security Object Type',
    desc: 'What type of object this permission applies to. Permissions layer from general to specific.',
    options: [
      { val: 'Application',             meaning: 'Controls whether the group can log into the application at all. Also controls which application-level features are visible (navigation menus, settings). Foundation level — all groups need at least Read Only at Application level.' },
      { val: 'Cube',                    meaning: 'Controls data access within a specific cube. Read/Write enables data entry. Read Only enables reporting only. No Access hides the cube entirely. Most security decisions are made at cube level.' },
      { val: 'Workflow Profile',        meaning: 'Controls which workflow profiles the group can see and interact with. Can be used to hide planning workflow from consolidation-only users, or vice versa.' },
      { val: 'Dashboard',               meaning: 'Controls visibility of specific dashboards and dashboard groups. Use to hide sensitive management dashboards from entity-level users.' },
      { val: 'Report Book',             meaning: 'Controls access to Report Books (formatted output document packages). Common use: restrict Board reporting packs to Executive group only.' },
      { val: 'Data — Entity Member',    meaning: 'Member-level security on the Entity dimension. Restricts which entities this group can see and interact with. Most powerful security tool for entity isolation. GRP_ENTITY_FINANCE should typically only see their own assigned entities.' },
      { val: 'Data — Account Member',   meaning: 'Member-level security on the Account dimension. Use to hide sensitive accounts (executive compensation, M&A pipeline) from standard users. Less commonly needed than entity-level security.' },
      { val: 'Business Rule',           meaning: 'Controls which business rules a group can execute manually. Use to prevent entity-level users from running consolidation engines or sensitive data manipulation rules.' },
    ],
  },
  {
    col: 'Object Name',
    desc: 'The specific object being secured. For Cube: the Cube ID (e.g., CONSOL). For Workflow: the profile name. For Entity Member: the entity name or parent entity (grants access to all children). Use "ALL" to apply to all objects of that type.',
  },
  {
    col: 'Permission Level',
    desc: 'The level of access being granted.',
    options: [
      { val: 'Full Access',         meaning: 'Complete access: create, modify, delete, execute. For cubes: can read, write, and run consolidation. For application: can modify settings and configuration. Only appropriate for Admin groups.' },
      { val: 'Read / Write',        meaning: 'Can view existing data and enter new data. Cannot modify system configuration. The standard permission for finance users who need to input data.' },
      { val: 'Read Only',           meaning: 'View only. Can see data in reports and dashboards but cannot enter, modify, or delete anything. Standard for executives, auditors, and anyone who only needs to consume information.' },
      { val: 'No Access (Deny)',    meaning: 'Explicitly denies access. This OVERRIDES any other permission at a less specific level. If a user is in a group with Application Read/Write but their cube permission is No Access, they cannot access that cube. Use deny rules sparingly and document carefully.' },
    ],
  },
];

export default function StepRoles({ data, onChange }) {
  const d = data || {};
  const f = (k, v) => onChange({ ...d, [k]: v });

  return (
    <div>
      <InfoBox type="info" title="Role Assignments — Layered Access Control Architecture">
        OneStream's security model works from most general (Application) to most specific (individual dimension member). Permissions at a more specific level supplement — and in the case of Deny rules, override — permissions from more general levels. The recommended approach is to grant broad Application-level access first, then restrict at the Cube, Workflow, and Member levels where finer control is needed. This minimizes the number of individual permission rows needed.
      </InfoBox>

      <div className="form-card">
        <div className="form-card-title"><i className="ti ti-shield-check" />Role Assignments</div>
        <ColumnGuide columns={ROLES_GUIDE} />
        <TblInput cols={COLS} rows={d.roles || []} onChange={(r) => f('roles', r)} addLabel="Add role" csvFilename="role-assignments" />
      </div>

      <InfoBox type="tip" title="Recommended Permission Matrix — Standard 5-Group Model">
        <strong>GRP_SYS_ADMIN</strong>: Application → Full Access (inherits everything by default)<br />
        <strong>GRP_CONFIGURATOR</strong>: Application → Read/Write + All Cubes → Full Access + Business Rules → Full Access<br />
        <strong>GRP_CORP_FINANCE</strong>: Application → Read/Write + All Cubes → Read/Write + All Workflows → Read/Write + All Dashboards → Read/Write<br />
        <strong>GRP_ENTITY_FINANCE</strong>: Application → Read/Write + All Cubes → Read/Write + Entity Member → [assigned entities only] + Dashboards → Read/Write<br />
        <strong>GRP_READ_ONLY</strong>: Application → Read Only + All Cubes → Read Only + All Dashboards → Read Only<br /><br />
        The critical piece for GRP_ENTITY_FINANCE is the <strong>Entity Member security</strong> row — this restricts them to only seeing data for their assigned entities. Without this, all entity users can see each other's data, which is typically unacceptable.
      </InfoBox>

      <InfoBox type="warning" title="Test with Simulate User Before Go-Live — Every Group">
        OneStream's "Simulate User" feature (Admin → Security → Simulate User) lets you browse the application as if you were a member of any group. <strong>Use this to verify every group's access before go-live.</strong><br /><br />
        Run through this checklist for each group:<br />
        ✓ Can they see the dashboards they should see?<br />
        ✓ Can they NOT see dashboards they shouldn't see?<br />
        ✓ For GRP_ENTITY_FINANCE: can they only see their own entities' data?<br />
        ✓ For GRP_READ_ONLY: confirm they cannot modify any data (try entering a value)<br />
        ✓ For GRP_CONFIGURATOR: confirm they cannot access System Admin settings<br /><br />
        Security misconfigurations discovered in production are one of the most embarrassing and potentially serious incidents in any implementation. Test proactively.
      </InfoBox>
    </div>
  );
}
