import { esc, osHeader, osFooter, ind } from './xmlEscape';

// Map our target dimension names to the OneStream stage dimension names
const DIM_STAGE_MAP = {
  'Account':   'Account',
  'Entity':    'Entity',
  'Scenario':  'Scenario',
  'Time':      'Time',
  'Flow':      'Flow',
  'UD1': 'UD1', 'UD2': 'UD2', 'UD3': 'UD3', 'UD4': 'UD4',
  'UD5': 'UD5', 'UD6': 'UD6', 'UD7': 'UD7', 'UD8': 'UD8',
  'ICP': 'IC',
};

// Map our method names to OneStream rule types
function ruleType(method) {
  if (!method) return 'TransformMask';
  if (method.includes('OneToOne') || method.includes('Direct')) return 'TransformOneToOne';
  return 'TransformMask';
}

function ruleExpression(method, sampleSource) {
  if (method?.includes('Default')) return '*';
  if (method?.includes('Direct') || method?.includes('OneToOne')) return sampleSource || '*';
  if (method?.includes('Substitution')) return sampleSource || '*';
  // Lookup Table / Mask — use sample value or wildcard
  return sampleSource || '*';
}

export function generateTransformationRules(project) {
  const tr     = project.steps?.['transform'] || {};
  const transforms = tr.transforms || [];
  const cube   = (project.steps?.['cube-props']?.cubes?.[0]?.cubeId) ||
                 (project.steps?.['cube-props']?.cubes?.[0]?.name) || 'CubeName';

  // Group transforms by target dimension
  const byDim = {};
  for (const t of transforms) {
    const dim = t.target || 'Account';
    if (!byDim[dim]) byDim[dim] = [];
    byDim[dim].push(t);
  }

  // If no transforms configured, generate example groups for core dimensions
  const hasDims = Object.keys(byDim).length > 0;
  if (!hasDims) {
    byDim['Account']  = [];
    byDim['Entity']   = [];
    byDim['Scenario'] = [];
  }

  const lines = [
    ...osHeader(),
    `${ind(1)}<transformationRulesRoot>`,
    '',
    `${ind(2)}<businessRules />`,
    '',
    `${ind(2)}<transformationGroups>`,
    '',
    `${ind(3)}<!-- ── Transformation Groups ───────────────────────────────────────── -->`,
    `${ind(3)}<!-- Import via: Application → Data Integration → Transformation Rules  -->`,
    `${ind(3)}<!-- Each group maps source field values to a target finance dimension.  -->`,
    '',
  ];

  let order = 10;
  for (const [dim, rules] of Object.entries(byDim)) {
    const stageDim = DIM_STAGE_MAP[dim] || dim;
    const groupName = `${stageDim}_TransformGroup`;

    lines.push(`${ind(3)}<transformationGroup`);
    lines.push(`${ind(4)}name="${groupName}"`);
    lines.push(`${ind(4)}description="Maps source ${dim} values to finance dimension members"`);
    lines.push(`${ind(4)}stageDimName="${stageDim}"`);
    lines.push(`${ind(4)}financeDimName="${stageDim}"`);
    lines.push(`${ind(4)}accessGroup="Everyone"`);
    lines.push(`${ind(4)}maintenanceGroup="Administrators">`);
    lines.push(`${ind(4)}<transformationRules>`);
    lines.push('');

    if (rules.length === 0) {
      // Generate placeholder comments
      lines.push(`${ind(5)}<!-- TODO: Add mapping rules for ${dim} dimension -->`);
      lines.push(`${ind(5)}<!-- Example: map source value "12345" to finance member "ACCT_MEMBER" -->`);
      lines.push(`${ind(5)}<transformationRule`);
      lines.push(`${ind(6)}name="${groupName}_Example"`);
      lines.push(`${ind(6)}type="TransformOneToOne"`);
      lines.push(`${ind(6)}description="Example — replace with actual mappings"`);
      lines.push(`${ind(6)}outputValue="TARGET_MEMBER"`);
      lines.push(`${ind(6)}flipSign="false"`);
      lines.push(`${ind(6)}ruleExpression="SOURCE_VALUE"`);
      lines.push(`${ind(6)}logicalOperator=""`);
      lines.push(`${ind(6)}logicalExpression=""`);
      lines.push(`${ind(6)}derivativeType=""`);
      lines.push(`${ind(6)}executionOrder="${order}" />`);
      order += 10;
      lines.push('');
    } else {
      let execOrder = 10;
      for (const rule of rules) {
        const type    = ruleType(rule.method);
        const expr    = ruleExpression(rule.method, rule.sampleSource);
        const output  = rule.sampleTarget || rule.notes || 'TARGET_MEMBER';
        const isDefaultMethod = rule.method?.includes('Default');

        lines.push(`${ind(5)}<transformationRule`);
        lines.push(`${ind(6)}name="${esc(groupName)}_${esc(rule.source || 'Rule')}_${execOrder}"`);
        lines.push(`${ind(6)}type="${type}"`);
        lines.push(`${ind(6)}description="${esc(rule.notes || `Map ${rule.source || ''} → ${output}`)}"`);
        lines.push(`${ind(6)}outputValue="${esc(output)}"`);
        lines.push(`${ind(6)}flipSign="false"`);
        lines.push(`${ind(6)}ruleExpression="${esc(isDefaultMethod ? '*' : expr)}"`);
        lines.push(`${ind(6)}logicalOperator=""`);
        lines.push(`${ind(6)}logicalExpression=""`);
        lines.push(`${ind(6)}derivativeType=""`);
        lines.push(`${ind(6)}executionOrder="${execOrder}" />`);
        lines.push('');
        execOrder += 10;
      }
    }

    // Always add a catch-all UNMAPPED rule as last entry
    const unmappedMember = `UNMAPPED_${stageDim.toUpperCase()}`;
    lines.push(`${ind(5)}<!-- Catch-all: routes unmatched source values to an error member for exception reporting -->`);
    lines.push(`${ind(5)}<transformationRule`);
    lines.push(`${ind(6)}name="${groupName}_CatchAll"`);
    lines.push(`${ind(6)}type="TransformMask"`);
    lines.push(`${ind(6)}description="Catch-all: any value not matched above → ${unmappedMember}"`);
    lines.push(`${ind(6)}outputValue="${unmappedMember}"`);
    lines.push(`${ind(6)}flipSign="false"`);
    lines.push(`${ind(6)}ruleExpression="*"`);
    lines.push(`${ind(6)}logicalOperator=""`);
    lines.push(`${ind(6)}logicalExpression=""`);
    lines.push(`${ind(6)}derivativeType=""`);
    lines.push(`${ind(6)}executionOrder="99999" />`);
    lines.push('');

    lines.push(`${ind(4)}</transformationRules>`);
    lines.push(`${ind(3)}</transformationGroup>`);
    lines.push('');
  }

  // Transformation Profiles section
  lines.push(`${ind(2)}</transformationGroups>`);
  lines.push('');
  lines.push(`${ind(2)}<transformationProfiles>`);
  lines.push(`${ind(3)}<!-- Link transformation groups to cube/scenario combinations -->`);

  const scenTypes = (project.steps?.['scenario']?.scenarios || []).map(s => s.type || 'Actual');
  const uniqueTypes = [...new Set(scenTypes)];

  if (Object.keys(byDim).length > 0 && hasDims) {
    const profileName = `${cube}_TransformProfile`;
    lines.push(`${ind(3)}<transformationProfile`);
    lines.push(`${ind(4)}name="${esc(profileName)}"`);
    lines.push(`${ind(4)}cubeName="${esc(cube)}"`);
    lines.push(`${ind(4)}scenarioTypeName="(All)"`);
    lines.push(`${ind(4)}accessGroup="Everyone"`);
    lines.push(`${ind(4)}maintenanceGroup="Administrators">`);
    lines.push(`${ind(4)}<members>`);
    for (const dim of Object.keys(byDim)) {
      const stageDim  = DIM_STAGE_MAP[dim] || dim;
      const groupName = `${stageDim}_TransformGroup`;
      lines.push(`${ind(5)}<member name="${esc(groupName)}" />`);
    }
    lines.push(`${ind(4)}</members>`);
    lines.push(`${ind(3)}</transformationProfile>`);
  }

  lines.push(`${ind(2)}</transformationProfiles>`);
  lines.push('');
  lines.push(`${ind(1)}</transformationRulesRoot>`);
  lines.push(...osFooter());

  return lines.join('\n');
}
