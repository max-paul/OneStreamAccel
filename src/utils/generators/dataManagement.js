import { esc, osHeader, osFooter, ind } from './xmlEscape';

export function generateDataManagement(project) {
  const lr      = project.steps?.['load-rules'] || {};
  const rules   = lr.loadRules || [];
  const cube    = (project.steps?.['cube-props']?.cubes?.[0]?.cubeId) ||
                  (project.steps?.['cube-props']?.cubes?.[0]?.name) || 'CubeName';

  const lines = [
    ...osHeader(),
    `${ind(1)}<dataManagementRoot>`,
    `${ind(2)}<dataManagementGroups>`,
    '',
    `${ind(3)}<!-- ── Data Management Groups ──────────────────────────────────────── -->`,
    `${ind(3)}<!-- Import via: Application → Data Integration → Data Management      -->`,
    `${ind(3)}<!-- Each group contains steps and sequences for a data load process.  -->`,
    '',
  ];

  // Generate one DM group per cube, containing steps and sequences for all load rules for that cube
  const cubes = [...new Set(rules.map(r => r.cube || cube))];
  if (cubes.length === 0) cubes.push(cube);

  for (const cubeName of cubes) {
    const cubeRules = rules.filter(r => (r.cube || cube) === cubeName);
    const groupName = `${cubeName}_DataLoad`;

    lines.push(`${ind(3)}<dataManagementGroup`);
    lines.push(`${ind(4)}name="${esc(groupName)}"`);
    lines.push(`${ind(4)}workspace="Default"`);
    lines.push(`${ind(4)}maintenanceUnit=""`);
    lines.push(`${ind(4)}description="Data load steps for ${esc(cubeName)} cube"`);
    lines.push(`${ind(4)}accessGroup="Everyone"`);
    lines.push(`${ind(4)}maintenanceGroup="Administrators">`);
    lines.push('');
    lines.push(`${ind(4)}<dataManagementSteps>`);
    lines.push('');

    if (cubeRules.length === 0) {
      // Generate example steps
      lines.push(`${ind(5)}<!-- ClearData step: clears data before loading -->`);
      lines.push(`${ind(5)}<dataManagementStep`);
      lines.push(`${ind(6)}name="${esc(cubeName)}_ClearData"`);
      lines.push(`${ind(6)}description="Clear ${esc(cubeName)} data for current period before load"`);
      lines.push(`${ind(6)}stepType="ClearData">`);
      lines.push(`${ind(6)}<stepDefinition>`);
      lines.push(`${ind(7)}<DataMgmtClearDataDefinition>`);
      lines.push(`${ind(8)}<UseDetailedLogging>false</UseDetailedLogging>`);
      lines.push(`${ind(8)}<Cube>${esc(cubeName)}</Cube>`);
      lines.push(`${ind(8)}<EntityFilter>AllEntities</EntityFilter>`);
      lines.push(`${ind(8)}<Scenario>|PovScenario|</Scenario>`);
      lines.push(`${ind(8)}<TimeFilter>|PovTime|</TimeFilter>`);
      lines.push(`${ind(8)}<ProcessImportedData>true</ProcessImportedData>`);
      lines.push(`${ind(8)}<ProcessFormsData>false</ProcessFormsData>`);
      lines.push(`${ind(8)}<ProcessJournalsAndAdjustments>false</ProcessJournalsAndAdjustments>`);
      lines.push(`${ind(7)}</DataMgmtClearDataDefinition>`);
      lines.push(`${ind(6)}</stepDefinition>`);
      lines.push(`${ind(5)}</dataManagementStep>`);
      lines.push('');
    } else {
      // Generate steps for each configured load rule
      for (const rule of cubeRules) {
        const stepName    = esc(rule.name || `${cubeName}_Load`);
        const clearFirst  = rule.clearFirst === 'Yes — Clear period first' || rule.clearFirst === 'Yes';
        const method      = rule.method || 'Merge (add/update)';
        const isReplace   = method.includes('Replace');

        // ClearData step if rule calls for it
        if (clearFirst || isReplace) {
          lines.push(`${ind(5)}<!-- Clear step for: ${stepName} -->`);
          lines.push(`${ind(5)}<dataManagementStep`);
          lines.push(`${ind(6)}name="${stepName}_ClearData"`);
          lines.push(`${ind(6)}description="Clear ${esc(cubeName)} before loading ${stepName}"`);
          lines.push(`${ind(6)}stepType="ClearData">`);
          lines.push(`${ind(6)}<stepDefinition>`);
          lines.push(`${ind(7)}<DataMgmtClearDataDefinition>`);
          lines.push(`${ind(8)}<UseDetailedLogging>false</UseDetailedLogging>`);
          lines.push(`${ind(8)}<Cube>${esc(rule.cube || cubeName)}</Cube>`);
          lines.push(`${ind(8)}<EntityFilter>AllEntities</EntityFilter>`);
          lines.push(`${ind(8)}<Scenario>${esc(rule.scenario || '|PovScenario|')}</Scenario>`);
          lines.push(`${ind(8)}<TimeFilter>|PovTime|</TimeFilter>`);
          lines.push(`${ind(8)}<ProcessImportedData>true</ProcessImportedData>`);
          lines.push(`${ind(8)}<ProcessFormsData>false</ProcessFormsData>`);
          lines.push(`${ind(8)}<ProcessJournalsAndAdjustments>false</ProcessJournalsAndAdjustments>`);
          lines.push(`${ind(7)}</DataMgmtClearDataDefinition>`);
          lines.push(`${ind(6)}</stepDefinition>`);
          lines.push(`${ind(5)}</dataManagementStep>`);
          lines.push('');
        }

        // Calculate/Consolidate step after load
        lines.push(`${ind(5)}<!-- Calculate step for: ${stepName} -->`);
        lines.push(`${ind(5)}<dataManagementStep`);
        lines.push(`${ind(6)}name="${stepName}_Calculate"`);
        lines.push(`${ind(6)}description="Calculate ${esc(cubeName)} after loading ${stepName}"`);
        lines.push(`${ind(6)}stepType="Calculate">`);
        lines.push(`${ind(6)}<stepDefinition>`);
        lines.push(`${ind(7)}<DataMgmtCalculateDefinition>`);
        lines.push(`${ind(8)}<CalculationType>Consolidate</CalculationType>`);
        lines.push(`${ind(8)}<ExecuteHybridSourceDataCopy>Unknown</ExecuteHybridSourceDataCopy>`);
        lines.push(`${ind(8)}<Cube>${esc(rule.cube || cubeName)}</Cube>`);
        lines.push(`${ind(8)}<EntityFilter>E#|PovEntity|</EntityFilter>`);
        lines.push(`${ind(8)}<ParentFilter />`);
        lines.push(`${ind(8)}<ConsFilter>C#Local</ConsFilter>`);
        lines.push(`${ind(8)}<ScenarioFilter>S#${esc(rule.scenario || '|PovScenario|')}</ScenarioFilter>`);
        lines.push(`${ind(8)}<TimeFilter>T#|PovTime|</TimeFilter>`);
        lines.push(`${ind(7)}</DataMgmtCalculateDefinition>`);
        lines.push(`${ind(6)}</stepDefinition>`);
        lines.push(`${ind(5)}</dataManagementStep>`);
        lines.push('');
      }
    }

    lines.push(`${ind(4)}</dataManagementSteps>`);
    lines.push('');
    lines.push(`${ind(4)}<dataManagementSequences>`);
    lines.push('');

    // One master sequence per cube that chains all steps
    const seqName    = `${cubeName}_FullLoad`;
    const stepNames  = cubeRules.length > 0
      ? cubeRules.flatMap(r => {
          const base  = r.name || `${cubeName}_Load`;
          const steps = [];
          const clearFirst = r.clearFirst === 'Yes — Clear period first' || r.clearFirst === 'Yes';
          const isReplace  = (r.method || '').includes('Replace');
          if (clearFirst || isReplace) steps.push(`${base}_ClearData`);
          steps.push(`${base}_Calculate`);
          return steps;
        })
      : [`${cubeName}_ClearData`];

    lines.push(`${ind(5)}<dataManagementSequence`);
    lines.push(`${ind(6)}name="${esc(seqName)}"`);
    lines.push(`${ind(6)}description="Full data load sequence for ${esc(cubeName)}">`);
    lines.push(`${ind(6)}<sequenceDefinition>`);
    lines.push(`${ind(7)}<DataMgmtSequenceDefinition>`);
    lines.push(`${ind(8)}<AppServer></AppServer>`);
    lines.push(`${ind(8)}<EnableNotifications>false</EnableNotifications>`);
    lines.push(`${ind(8)}<NotificationServer></NotificationServer>`);
    lines.push(`${ind(8)}<NotificationEventType></NotificationEventType>`);
    lines.push(`${ind(8)}<Parameters>`);
    lines.push(`${ind(9)}<Parameter SubstVarName="PovScenario"><DefaultValue>Actual</DefaultValue></Parameter>`);
    lines.push(`${ind(9)}<Parameter SubstVarName="PovTime"><DefaultValue></DefaultValue></Parameter>`);
    lines.push(`${ind(9)}<Parameter SubstVarName="PovEntity"><DefaultValue>AllEntities</DefaultValue></Parameter>`);
    lines.push(`${ind(8)}</Parameters>`);
    lines.push(`${ind(8)}<stepMembers>`);
    for (const s of stepNames) {
      lines.push(`${ind(9)}<stepMember name="${esc(s)}" />`);
    }
    lines.push(`${ind(8)}</stepMembers>`);
    lines.push(`${ind(7)}</DataMgmtSequenceDefinition>`);
    lines.push(`${ind(6)}</sequenceDefinition>`);
    lines.push(`${ind(5)}</dataManagementSequence>`);
    lines.push('');

    lines.push(`${ind(4)}</dataManagementSequences>`);
    lines.push('');
    lines.push(`${ind(3)}</dataManagementGroup>`);
    lines.push('');
  }

  lines.push(`${ind(2)}</dataManagementGroups>`);
  lines.push(`${ind(1)}</dataManagementRoot>`);
  lines.push(...osFooter());

  return lines.join('\n');
}
