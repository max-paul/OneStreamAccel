import { esc, osHeader, osFooter, ind } from './xmlEscape';

// Standard attribute block shared by all profile types
function scenarioTypeBlock(scenName, extra = {}, depth = 3) {
  const attrs = {
    ProfileDescription:            extra.description || '',
    Workflow:                      'Standard',
    WorkflowExecutionGroup:        '',
    WorkspaceDashboardWorkflow:    '',
    Active:                        'Yes',
    ICMatchingEnabled:             'No',
    ICMatchingParameters:          '',
    CubeViewProfile:               '',
    ProcessCubeDashboardProfile:   '',
    ConfirmationProfile:           '',
    ConfirmationDashboardProfile:  '',
    CertificationProfile:          extra.certProfile || '',
    CertificationSignOffGroup:     extra.certSignOff || '',
    CertificationDashboardProfile: '',
    Text1: '', Text2: '', Text3: '', Text4: '',
    ...extra.attrs,
  };

  const lines = [
    `${ind(depth)}<scenarioType name="${esc(scenName)}">`,
    `${ind(depth + 1)}<attributes>`,
  ];
  for (const [k, v] of Object.entries(attrs)) {
    lines.push(`${ind(depth + 2)}<attribute attributeName="${k}" attributeValue="${esc(v)}" />`);
  }
  lines.push(`${ind(depth + 1)}</attributes>`);
  lines.push(`${ind(depth)}</scenarioType>`);
  return lines;
}

function workflowProfile({ name, parentName, type, cubeName, inputTemplate, description, certProfile, certSignOff }, depth = 2) {
  const lines = [
    `${ind(depth)}<workflowProfile`,
    `${ind(depth + 1)}name="${esc(name)}"`,
    `${ind(depth + 1)}parentName="${esc(parentName || '')}"`,
    `${ind(depth + 1)}type="${esc(type)}"`,
    `${ind(depth + 1)}cubeName="${esc(cubeName)}"`,
    `${ind(depth + 1)}inputTemplateName="${esc(inputTemplate || '')}"`,
    `${ind(depth + 1)}accessGroup="Everyone"`,
    `${ind(depth + 1)}maintenanceGroup="Administrators">`,
    `${ind(depth + 1)}<scenarioTypes>`,
    ...scenarioTypeBlock('(Default)', { description, certProfile, certSignOff }, depth + 2),
    `${ind(depth + 1)}</scenarioTypes>`,
    `${ind(depth + 1)}<profileEntities />`,
    `${ind(depth + 1)}<profileEntityCalcs />`,
    `${ind(depth)}</workflowProfile>`,
    '',
  ];
  return lines;
}

export function generateWorkflowProfiles(project) {
  const wf      = project.steps?.['workflow']      || {};
  const lr      = project.steps?.['load-rules']    || {};
  const cert    = project.steps?.['certification'] || {};
  const cubes   = project.steps?.['cube-props']?.cubes || [];
  const workflows = wf.workflows || [];
  const loadRules = lr.loadRules || [];
  const certProfiles = cert.certifications || [];

  const lines = [
    ...osHeader(),
    `${ind(1)}<workflowProfilesRoot>`,
    '',
    `${ind(2)}<workflowProfiles>`,
    '',
    `${ind(3)}<!-- ── Workflow Profiles ───────────────────────────────────────────── -->`,
    `${ind(3)}<!-- Import via: Application → Workflow → Profiles                     -->`,
    `${ind(3)}<!-- Structure: CubeRoot → Default → ImportChild / FormsChild          -->`,
    '',
  ];

  // For each cube, generate the profile hierarchy
  const cubesToProcess = cubes.length > 0
    ? cubes
    : [{ cubeId: 'CubeName', name: 'CubeName' }];

  for (const cube of cubesToProcess) {
    const cubeName     = cube.cubeId || cube.name || 'CubeName';
    const rootName     = `${cubeName}_Root`;
    const defaultName  = `${cubeName}_Default`;

    // Get workflow config for this cube
    const cubeWorkflow = workflows.find(w => w.scenario) || workflows[0];
    const wfDesc       = cubeWorkflow ? `${cubeWorkflow.name || cubeName} — ${cubeWorkflow.scenario || 'Actual'}` : cubeName;

    // Get cert profile name if any
    const certProfile = certProfiles.length > 0 ? `${cubeName}_CertProfile` : '';

    // CubeRoot
    lines.push(`${ind(3)}<!-- ── ${cubeName}: Root Profile ── -->`);
    lines.push(...workflowProfile({
      name: rootName, parentName: '', type: 'CubeRoot', cubeName,
      description: `${cubeName} workflow root`, certProfile,
    }, 3));

    // Default child
    lines.push(...workflowProfile({
      name: defaultName, parentName: rootName, type: 'Default', cubeName,
      description: wfDesc, certProfile,
    }, 3));

    // ImportChild for each load rule targeting this cube
    const cubeLoadRules = loadRules.filter(r => (r.cube || cubeName) === cubeName);
    if (cubeLoadRules.length > 0) {
      for (const rule of cubeLoadRules) {
        lines.push(...workflowProfile({
          name: `${esc(rule.name || cubeName)}_Import`,
          parentName: defaultName,
          type: 'InputImportChild',
          cubeName,
          inputTemplate: rule.source || rule.name || '',
          description: `Data import: ${rule.name || ''}`,
        }, 3));
      }
    } else {
      // Example import child
      lines.push(...workflowProfile({
        name: `${cubeName}_Import`,
        parentName: defaultName,
        type: 'InputImportChild',
        cubeName,
        inputTemplate: `${cubeName}_DataSource`,
        description: 'Data import — link to data source',
      }, 3));
    }
  }

  lines.push(`${ind(2)}</workflowProfiles>`);
  lines.push('');

  // WorkflowProfileTemplates
  lines.push(`${ind(2)}<workflowProfileTemplates>`);
  lines.push('');
  lines.push(`${ind(3)}<!-- ── Workflow Profile Templates ── -->`);
  lines.push(`${ind(3)}<!-- Templates define reusable profile patterns for new entities  -->`);
  lines.push('');

  for (const cube of cubesToProcess) {
    const cubeName = cube.cubeId || cube.name || 'CubeName';
    lines.push(`${ind(3)}<workflowProfileTemplate`);
    lines.push(`${ind(4)}name="${cubeName}_Template"`);
    lines.push(`${ind(4)}parentName=""`);
    lines.push(`${ind(4)}type="Template"`);
    lines.push(`${ind(4)}cubeName="${cubeName}"`);
    lines.push(`${ind(4)}inputTemplateName=""`);
    lines.push(`${ind(4)}accessGroup="Everyone"`);
    lines.push(`${ind(4)}maintenanceGroup="Administrators">`);
    lines.push(`${ind(4)}<scenarioTypes>`);
    lines.push(...scenarioTypeBlock('(Default)', { description: `Template for ${cubeName}` }, 5));
    lines.push(`${ind(4)}</scenarioTypes>`);
    lines.push(`${ind(3)}</workflowProfileTemplate>`);
    lines.push('');
  }

  lines.push(`${ind(2)}</workflowProfileTemplates>`);
  lines.push('');
  lines.push(`${ind(1)}</workflowProfilesRoot>`);
  lines.push(...osFooter());

  return lines.join('\n');
}
