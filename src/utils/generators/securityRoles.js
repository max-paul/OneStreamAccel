import { esc, osHeader, osFooter, ind } from './xmlEscape';

export function generateApplicationSecurityRoles(project) {
  const ug     = project.steps?.['user-groups'] || {};
  const groups = ug.groups || [];

  // Map our access levels to OneStream role name conventions
  const ROLE_NAME_MAP = {
    'System Administrator':       'SystemAdministrator',
    'Application Administrator':  'ApplicationAdministrator',
    'Power User / Configurator':  'PowerUser',
    'Process Owner':              'ProcessOwner',
    'Standard User':              'StandardUser',
    'Data Entry Only':            'DataEntry',
    'Read Only / Executive':      'ReadOnly',
    'External Auditor':           'ExternalAuditor',
  };

  const lines = [
    ...osHeader(),
    `${ind(1)}<applicationSecurityRolesRoot>`,
    `${ind(2)}<applicationSecurityRoles>`,
    '',
    `${ind(3)}<!-- ── Security Role Assignments ───────────────────────────────────── -->`,
    `${ind(3)}<!-- Import via: Administration → Application → Security → Import Roles -->`,
    `${ind(3)}<!-- Each role maps a OneStream security group to an application access level. -->`,
    '',
  ];

  if (groups.length === 0) {
    lines.push(`${ind(3)}<!-- No user groups configured — define groups in Phase 6: User Groups -->`);
  } else {
    for (const g of groups) {
      const roleName = ROLE_NAME_MAP[g.type] || g.type || 'StandardUser';
      lines.push(`${ind(3)}<role`);
      lines.push(`${ind(4)}name="${esc(roleName)}"`);
      lines.push(`${ind(4)}accessGroup="${esc(g.name)}"`);
      lines.push(`${ind(4)}accessGroupType="${esc(g.name)}" />`);
      lines.push('');
    }
  }

  // Always include Everyone → ReadOnly as a safety net
  const hasEveryone = groups.some(g => g.name === 'Everyone');
  if (!hasEveryone) {
    lines.push(`${ind(3)}<!-- Safety net: Everyone gets ReadOnly by default -->`);
    lines.push(`${ind(3)}<role name="ReadOnly" accessGroup="Everyone" accessGroupType="Everyone" />`);
    lines.push('');
  }

  lines.push(
    `${ind(2)}</applicationSecurityRoles>`,
    `${ind(1)}</applicationSecurityRolesRoot>`,
    ...osFooter(),
  );

  return lines.join('\n');
}
