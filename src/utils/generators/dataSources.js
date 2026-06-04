import { esc, osHeader, osFooter, ind } from './xmlEscape';

// Stage dimension positions (OneStream standard)
const DIM_POSITIONS = {
  'Scenario': { pos: 10,  name: 'Sn',   type: 'CurrentDataKeyScenario' },
  'Time':     { pos: 20,  name: 'Tm',   type: 'CurrentDataKeyTime' },
  'Entity':   { pos: 30,  name: 'E',    type: 'CurrentDataKeyEntity' },
  'Account':  { pos: 40,  name: 'A',    type: 'CurrentDataKeyAccount' },
  'Flow':     { pos: 50,  name: 'F',    type: 'CurrentDataKeyFlow' },
  'ICP':      { pos: 60,  name: 'IC',   type: 'CurrentDataKeyIC' },
  'UD1':      { pos: 70,  name: 'UD1',  type: 'CurrentDataKeyUD1' },
  'UD2':      { pos: 80,  name: 'UD2',  type: 'CurrentDataKeyUD2' },
  'UD3':      { pos: 90,  name: 'UD3',  type: 'CurrentDataKeyUD3' },
  'UD4':      { pos: 100, name: 'UD4',  type: 'CurrentDataKeyUD4' },
  'UD5':      { pos: 110, name: 'UD5',  type: 'CurrentDataKeyUD5' },
  'UD6':      { pos: 120, name: 'UD6',  type: 'CurrentDataKeyUD6' },
  'UD7':      { pos: 130, name: 'UD7',  type: 'CurrentDataKeyUD7' },
  'UD8':      { pos: 140, name: 'UD8',  type: 'CurrentDataKeyUD8' },
  'Amount':   { pos: 150, name: 'Amt',  type: 'Amount' },
  'SrcID':    { pos: 160, name: 'SrcID',type: 'SourceID' },
  'Label':    { pos: 170, name: 'Lbl',  type: 'Label' },
};

function dimElement(dimKey, colPosition, staticValue, depth = 4) {
  const d = DIM_POSITIONS[dimKey];
  if (!d) return [];
  const isAmount  = dimKey === 'Amount';
  const isStatic  = colPosition === 0;

  const lines = [
    `${ind(depth)}<dimension position="${d.pos}" stageDimName="${d.name}" dataType="${d.type}">`,
    `${ind(depth + 1)}<attributes>`,
  ];

  if (isAmount) {
    lines.push(`${ind(depth + 2)}<attribute attributeName="DelimitedPosition"   attributeValue="${colPosition}" />`);
    lines.push(`${ind(depth + 2)}<attribute attributeName="NumericFactor"        attributeValue="1" />`);
    lines.push(`${ind(depth + 2)}<attribute attributeName="NumericPrecision"     attributeValue="0" />`);
    lines.push(`${ind(depth + 2)}<attribute attributeName="NumericZeroSuppress"  attributeValue="false" />`);
    lines.push(`${ind(depth + 2)}<attribute attributeName="NumericMarker"        attributeValue="" />`);
  } else {
    lines.push(`${ind(depth + 2)}<attribute attributeName="DelimitedPosition"   attributeValue="${colPosition}" />`);
    lines.push(`${ind(depth + 2)}<attribute attributeName="TextStaticValue"     attributeValue="${esc(staticValue || '')}" />`);
    lines.push(`${ind(depth + 2)}<attribute attributeName="StoredTextBypass"    attributeValue="false" />`);
  }

  lines.push(`${ind(depth + 1)}</attributes>`);
  lines.push(`${ind(depth)}</dimension>`);
  return lines;
}

export function generateDataSources(project) {
  const ds         = project.steps?.['data-source'] || {};
  const tr         = project.steps?.['transform']   || {};
  const sources    = ds.sources || [];
  const transforms = tr.transforms || [];
  const cube       = (project.steps?.['cube-props']?.cubes?.[0]?.cubeId) ||
                     (project.steps?.['cube-props']?.cubes?.[0]?.name) || 'CubeName';
  const firstScen  = project.steps?.['scenario']?.scenarios?.[0];
  const scenName   = firstScen?.id || firstScen?.name || 'Actual';

  const lines = [
    ...osHeader(),
    `${ind(1)}<dataSourcesRoot>`,
    '',
    `${ind(2)}<businessRules />`,
    '',
    `${ind(2)}<dataSources>`,
    '',
    `${ind(3)}<!-- ── Data Source Definitions ─────────────────────────────────────── -->`,
    `${ind(3)}<!-- Import via: Application → Data Integration → Data Sources         -->`,
    `${ind(3)}<!-- Each data source defines how a file/connector maps to cube dims.   -->`,
    '',
  ];

  // Group transforms by method — "Default" ones get static values, others get column positions
  const defaultTransforms = transforms.filter(t => t.method?.includes('Default'));
  const columnTransforms  = transforms.filter(t => !t.method?.includes('Default'));

  // Build a column index for non-default transforms (1-based)
  const colMap = {};
  columnTransforms.forEach((t, i) => { colMap[t.target || 'Account'] = i + 1; });

  // Amount column = next after last column transform
  const amtCol = columnTransforms.length + 1;

  // Build static value map from default transforms
  const staticMap = {};
  defaultTransforms.forEach(t => {
    staticMap[t.target] = t.sampleTarget || '';
  });

  // If no sources configured, generate a generic example
  const sourcesToGenerate = sources.length > 0 ? sources : [{
    name: 'CSV_Actuals_Monthly',
    type: 'CSV / Flat File',
    desc: 'Example CSV data source — configure with actual source details',
  }];

  for (const src of sourcesToGenerate) {
    const isConnector = src.type?.toLowerCase().includes('connector') ||
                        src.type?.includes('REST') ||
                        src.type?.includes('JDBC');

    lines.push(`${ind(3)}<dataSource`);
    lines.push(`${ind(4)}name="${esc(src.name)}"`);
    lines.push(`${ind(4)}description="${esc(src.desc || '')}"`);
    lines.push(`${ind(4)}cubeName="${esc(cube)}"`);
    lines.push(`${ind(4)}scenarioTypeName="(All)"`);
    lines.push(`${ind(4)}dataSourceType="${isConnector ? 'Connector' : 'Delimited'}"`);
    lines.push(`${ind(4)}dataStructureType="Matrix"`);
    lines.push(`${ind(4)}delimiter=","`);
    lines.push(`${ind(4)}quoteCharacter="&quot;"`);
    lines.push(`${ind(4)}connectorName="${isConnector ? esc(src.name + '_Connector') : '(Unassigned)'}"`);
    lines.push(`${ind(4)}connectorUsesFile="false"`);
    lines.push(`${ind(4)}allowDynamicExcelLoads="false"`);
    lines.push(`${ind(4)}accessGroup="Everyone"`);
    lines.push(`${ind(4)}maintenanceGroup="Administrators">`);
    lines.push(`${ind(4)}<dimensions>`);
    lines.push('');
    lines.push(`${ind(5)}<!-- Scenario: static value "${scenName}" (all rows load to same scenario) -->`);
    lines.push(...dimElement('Scenario', 0, staticMap['Scenario'] || scenName));
    lines.push('');

    // Time — from file column or static
    const tmCol = colMap['Time'] || 0;
    lines.push(`${ind(5)}<!-- Time: ${tmCol > 0 ? `from file column ${tmCol}` : 'static value — update if time is in file'}  (format: YYYYMn e.g. 2024M1) -->`);
    lines.push(...dimElement('Time', tmCol, tmCol > 0 ? '' : '2024M1'));
    lines.push('');

    // Entity
    const entCol = colMap['Entity'] || 0;
    lines.push(`${ind(5)}<!-- Entity: ${entCol > 0 ? `from file column ${entCol}` : 'static — set if single entity or use column'} -->`);
    lines.push(...dimElement('Entity', entCol, entCol > 0 ? '' : staticMap['Entity'] || ''));
    lines.push('');

    // Account
    const acctCol = colMap['Account'] || 0;
    lines.push(`${ind(5)}<!-- Account: ${acctCol > 0 ? `from file column ${acctCol} (mapped via TransformationRules)` : 'static'} -->`);
    lines.push(...dimElement('Account', acctCol, acctCol > 0 ? '' : staticMap['Account'] || ''));
    lines.push('');

    // Flow — typically static
    lines.push(`${ind(5)}<!-- Flow: static value — adjust per your flow dimension design -->`);
    lines.push(...dimElement('Flow', 0, staticMap['Flow'] || 'Periodic'));
    lines.push('');

    // ICP — typically static [None]
    lines.push(`${ind(5)}<!-- IC: [None] for non-intercompany data, or from file column if IC tracking needed -->`);
    lines.push(...dimElement('ICP', 0, '[None]'));
    lines.push('');

    // UD dims — check if any are configured
    const udDims = project.steps?.['ud-dims']?.udDims || [];
    const activeUDs = udDims.filter(u => u.enabled !== 'Disabled');
    for (let u = 1; u <= 8; u++) {
      const udKey   = `UD${u}`;
      const udCol   = colMap[udKey] || 0;
      const udDim   = activeUDs.find(d => d.ud === udKey);
      const udTotal = udDim?.topMember || '[None]';
      const isActive = !!udDim && udDim.enabled !== 'Disabled';
      lines.push(`${ind(5)}<!-- UD${u}${udDim ? ` (${udDim.name})` : ''}: ${udCol > 0 ? `from column ${udCol}` : `static = ${udTotal}`} -->`);
      lines.push(...dimElement(udKey, udCol, udCol > 0 ? '' : (staticMap[udKey] || udTotal)));
      lines.push('');
    }

    // Amount
    lines.push(`${ind(5)}<!-- Amount: from file column ${amtCol} -->`);
    lines.push(...dimElement('Amount', amtCol, ''));
    lines.push('');

    // SourceID and Label
    lines.push(`${ind(5)}<!-- SourceID and Label: static identifiers for audit trail -->`);
    lines.push(...dimElement('SrcID', 0, esc(src.name)));
    lines.push('');
    lines.push(...dimElement('Label', 0, 'DataLoad'));
    lines.push('');

    lines.push(`${ind(4)}</dimensions>`);
    lines.push(`${ind(3)}</dataSource>`);
    lines.push('');
  }

  lines.push(`${ind(2)}</dataSources>`);
  lines.push('');
  lines.push(`${ind(1)}</dataSourcesRoot>`);
  lines.push(...osFooter());

  return lines.join('\n');
}
