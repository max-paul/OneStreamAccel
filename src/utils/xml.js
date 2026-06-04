function esc(val) {
  if (val == null) return '';
  return String(val)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function generateXML(project) {
  if (!project) return '';
  const s   = project.steps || {};
  const app  = s['app-props']    || {};
  const time = s['time-profile'] || {};
  const scen = s['scenario']     || {};
  const curr = s['currency']     || {};
  const ent  = s['entity']       || {};
  const acct = s['accounts']     || {};
  const flow = s['flow-dim']     || {};
  const ud   = s['ud-dims']      || {};
  const cube = s['cube-props']   || {};
  const cdim = s['cube-dims']    || {};
  const ds   = s['data-source']  || {};
  const tr   = s['transform']    || {};
  const lr   = s['load-rules']   || {};
  const wf   = s['workflow']     || {};
  const cert = s['certification']|| {};
  const tmpl = s['templates']    || {};
  const ug   = s['user-groups']  || {};
  const rol  = s['roles']        || {};
  const wfs  = s['workflow-sec'] || {};

  const lines = [];
  const i = (depth, str) => lines.push('  '.repeat(depth) + str);

  i(0, '<?xml version="1.0" encoding="utf-8"?>');
  i(0, '<!--');
  i(0, `  OneStream Platform v9 Application Configuration`);
  i(0, `  Application : ${esc(app.name || 'Unnamed')}`);
  i(0, `  Generated   : ${new Date().toISOString()}`);
  i(0, `  Tool        : OS Accelerator`);
  i(0, '-->');
  i(0, '');
  i(0, '<OneStreamApplication>');
  i(0, '');

  // ─── APPLICATION PROPERTIES ──────────────────────────────────────────────
  i(1, '<ApplicationProperties>');
  i(2, `<Name>${esc(app.name || 'Unnamed App')}</Name>`);
  i(2, `<ApplicationID>${esc(app.appId || 'APP001')}</ApplicationID>`);
  i(2, `<Description>${esc(app.description || '')}</Description>`);
  i(2, `<DefaultCurrency>${esc(app.currency || 'USD')}</DefaultCurrency>`);
  i(2, `<ConsolidationMethod>${esc(app.consol || 'Ownership')}</ConsolidationMethod>`);
  i(2, `<PlatformVersion>${esc(app.version || '9.x')}</PlatformVersion>`);
  if (app.implType)    i(2, `<ImplementationType>${esc(app.implType)}</ImplementationType>`);
  if (app.consolScope) i(2, `<ConsolidationScope>${esc(app.consolScope)}</ConsolidationScope>`);
  if (app.industry)    i(2, `<Industry>${esc(app.industry)}</Industry>`);
  if (app.instanceType)i(2, `<InstanceType>${esc(app.instanceType)}</InstanceType>`);
  if (app.environment) i(2, `<Environment>${esc(app.environment)}</Environment>`);
  if (app.goLiveTarget)i(2, `<GoLiveTarget>${esc(app.goLiveTarget)}</GoLiveTarget>`);
  i(1, '</ApplicationProperties>');
  i(0, '');

  // ─── TIME PROFILE ─────────────────────────────────────────────────────────
  i(1, '<TimeProfile>');
  i(2, `<StartYear>${esc(time.startYear || '2020')}</StartYear>`);
  i(2, `<EndYear>${esc(time.endYear || '2030')}</EndYear>`);
  i(2, `<PeriodFrequency>${esc(time.frequency || 'Monthly')}</PeriodFrequency>`);
  i(2, `<FiscalYearEnd>${esc(time.fyEnd || 'December')}</FiscalYearEnd>`);
  i(2, `<NumberOfPeriods>${esc(time.periods || '12')}</NumberOfPeriods>`);
  i(2, `<PriorPeriods>${esc(time.priorPeriods || '3')}</PriorPeriods>`);
  if (time.calendarType) i(2, `<CalendarType>${esc(time.calendarType)}</CalendarType>`);
  if (time.includeP0)    i(2, `<IncludePeriodZero>${esc(time.includeP0)}</IncludePeriodZero>`);
  if (time.ytdMethod)    i(2, `<YTDMethod>${esc(time.ytdMethod)}</YTDMethod>`);
  i(1, '</TimeProfile>');
  i(0, '');

  // ─── SCENARIOS ────────────────────────────────────────────────────────────
  const scenarios = scen.scenarios || [];
  if (scenarios.length) {
    i(1, '<Scenarios>');
    for (const sc of scenarios) {
      i(2, '<Scenario>');
      if (sc.id)          i(3, `<MemberName>${esc(sc.id)}</MemberName>`);
      i(3, `<Name>${esc(sc.name)}</Name>`);
      i(3, `<Type>${esc(sc.type)}</Type>`);
      i(3, `<LockType>${esc(sc.lock)}</LockType>`);
      if (sc.defaultView) i(3, `<DefaultView>${esc(sc.defaultView)}</DefaultView>`);
      if (sc.icpEnabled)  i(3, `<ICPEnabled>${esc(sc.icpEnabled)}</ICPEnabled>`);
      if (sc.desc)        i(3, `<Description>${esc(sc.desc)}</Description>`);
      i(2, '</Scenario>');
    }
    i(1, '</Scenarios>');
    i(0, '');
  }

  // ─── CURRENCIES ───────────────────────────────────────────────────────────
  const currencies = curr.currencies || [];
  if (currencies.length) {
    i(1, '<Currencies>');
    i(2, '<TranslationSettings>');
    i(3, `<DefaultRateType>${esc(curr.rateType || 'Closing')}</DefaultRateType>`);
    i(3, `<TranslationMethod>${esc(curr.transMethod || 'CTA')}</TranslationMethod>`);
    if (curr.triangulation) i(3, `<TriangulationEnabled>${esc(curr.triangulation)}</TriangulationEnabled>`);
    i(2, '</TranslationSettings>');
    for (const c of currencies) {
      i(2, '<Currency>');
      i(3, `<ISOCode>${esc(c.code)}</ISOCode>`);
      i(3, `<Name>${esc(c.name)}</Name>`);
      i(3, `<IsReportingCurrency>${c.default === 'Yes' ? 'true' : 'false'}</IsReportingCurrency>`);
      i(2, '</Currency>');
    }
    i(1, '</Currencies>');
    i(0, '');
  }

  // ─── ENTITY HIERARCHY ─────────────────────────────────────────────────────
  const entities = ent.entities || [];
  if (ent.topEntity || entities.length) {
    i(1, '<EntityHierarchy>');
    i(2, `<TopEntity>${esc(ent.topEntity || 'Total')}</TopEntity>`);
    for (const e of entities) {
      i(2, '<Entity>');
      if (e.entityId)      i(3, `<MemberName>${esc(e.entityId)}</MemberName>`);
      i(3, `<Name>${esc(e.name)}</Name>`);
      i(3, `<Parent>${esc(e.parent)}</Parent>`);
      i(3, `<LocalCurrency>${esc(e.currency || 'USD')}</LocalCurrency>`);
      i(3, `<EntityType>${esc(e.type)}</EntityType>`);
      i(3, `<ConsolMethod>${esc(e.consol)}</ConsolMethod>`);
      if (e.inputAllowed)  i(3, `<InputAllowed>${esc(e.inputAllowed)}</InputAllowed>`);
      if (e.holdingPct)    i(3, `<OwnershipPct>${esc(e.holdingPct)}</OwnershipPct>`);
      i(2, '</Entity>');
    }
    i(1, '</EntityHierarchy>');
    i(0, '');
  }

  // ─── CHART OF ACCOUNTS ────────────────────────────────────────────────────
  const accounts = acct.accounts || [];
  if (accounts.length) {
    i(1, '<ChartOfAccounts>');
    for (const a of accounts) {
      i(2, '<Account>');
      i(3, `<MemberName>${esc(a.code)}</MemberName>`);
      i(3, `<Description>${esc(a.name)}</Description>`);
      i(3, `<AccountType>${esc(a.type)}</AccountType>`);
      i(3, `<FlowType>${esc(a.flow)}</FlowType>`);
      i(3, `<ICPEnabled>${a.icp === 'Yes' ? 'true' : 'false'}</ICPEnabled>`);
      if (a.sign)         i(3, `<SignConvention>${esc(a.sign)}</SignConvention>`);
      if (a.inputAllowed) i(3, `<InputAllowed>${esc(a.inputAllowed)}</InputAllowed>`);
      if (a.parent)       i(3, `<ParentMember>${esc(a.parent)}</ParentMember>`);
      if (a.desc)         i(3, `<Notes>${esc(a.desc)}</Notes>`);
      i(2, '</Account>');
    }
    i(1, '</ChartOfAccounts>');
    i(0, '');
  }

  // ─── FLOW DIMENSION ───────────────────────────────────────────────────────
  const flows = flow.flows || [];
  if (flows.length) {
    i(1, '<FlowDimension>');
    for (const f of flows) {
      i(2, '<FlowMember>');
      i(3, `<Name>${esc(f.name)}</Name>`);
      i(3, `<MemberType>${esc(f.type)}</MemberType>`);
      if (f.translation) i(3, `<TranslationMethod>${esc(f.translation)}</TranslationMethod>`);
      if (f.desc)        i(3, `<Description>${esc(f.desc)}</Description>`);
      i(2, '</FlowMember>');
    }
    i(1, '</FlowDimension>');
    i(0, '');
  }

  // ─── USER-DEFINED DIMENSIONS ──────────────────────────────────────────────
  const udDims = ud.udDims || [];
  if (udDims.length) {
    i(1, '<UserDefinedDimensions>');
    for (const d of udDims) {
      i(2, '<UDDimension>');
      i(3, `<DimensionID>${esc(d.ud)}</DimensionID>`);
      i(3, `<BusinessName>${esc(d.name)}</BusinessName>`);
      i(3, `<Enabled>${esc(d.enabled || 'Yes')}</Enabled>`);
      if (d.topMember) i(3, `<TopMember>${esc(d.topMember)}</TopMember>`);
      if (d.purpose)   i(3, `<Purpose>${esc(d.purpose)}</Purpose>`);
      i(2, '</UDDimension>');
    }
    i(1, '</UserDefinedDimensions>');
    i(0, '');
  }

  // ─── CUBES ────────────────────────────────────────────────────────────────
  const cubes = cube.cubes || [];
  if (cubes.length) {
    i(1, '<Cubes>');
    for (const c of cubes) {
      i(2, '<Cube>');
      if (c.cubeId)     i(3, `<CubeID>${esc(c.cubeId)}</CubeID>`);
      i(3, `<Name>${esc(c.name)}</Name>`);
      i(3, `<CubeType>${esc(c.type)}</CubeType>`);
      if (c.enableICP)  i(3, `<EnableICP>${esc(c.enableICP)}</EnableICP>`);
      if (c.desc)       i(3, `<Description>${esc(c.desc)}</Description>`);
      i(2, '</Cube>');
    }
    i(1, '</Cubes>');
    i(0, '');
  }

  // ─── CUBE DIMENSION BINDINGS ──────────────────────────────────────────────
  const cubeDims = cdim.cubeDims || [];
  if (cubeDims.length) {
    i(1, '<CubeDimensionBindings>');
    for (const b of cubeDims) {
      i(2, '<Binding>');
      i(3, `<Cube>${esc(b.cube)}</Cube>`);
      i(3, `<Dimension>${esc(b.dim)}</Dimension>`);
      i(3, `<Required>${esc(b.required || 'Yes')}</Required>`);
      if (b.topMember)   i(3, `<TopMember>${esc(b.topMember)}</TopMember>`);
      if (b.defaultMember) i(3, `<DefaultMember>${esc(b.defaultMember)}</DefaultMember>`);
      if (b.notes)       i(3, `<Notes>${esc(b.notes)}</Notes>`);
      i(2, '</Binding>');
    }
    i(1, '</CubeDimensionBindings>');
    i(0, '');
  }

  // ─── DATA SOURCES ─────────────────────────────────────────────────────────
  const sources = ds.sources || [];
  if (sources.length) {
    i(1, '<DataSources>');
    for (const src of sources) {
      i(2, '<DataSource>');
      i(3, `<Name>${esc(src.name)}</Name>`);
      i(3, `<Type>${esc(src.type)}</Type>`);
      if (src.authMethod) i(3, `<AuthMethod>${esc(src.authMethod)}</AuthMethod>`);
      if (src.connection) i(3, `<ConnectionString>${esc(src.connection)}</ConnectionString>`);
      if (src.desc)       i(3, `<Description>${esc(src.desc)}</Description>`);
      i(2, '</DataSource>');
    }
    i(1, '</DataSources>');
    i(0, '');
  }

  // ─── TRANSFORMATION RULES ─────────────────────────────────────────────────
  const transforms = tr.transforms || [];
  if (transforms.length) {
    i(1, '<TransformationRules>');
    for (const t of transforms) {
      i(2, '<Rule>');
      i(3, `<SourceField>${esc(t.source)}</SourceField>`);
      i(3, `<TargetDimension>${esc(t.target)}</TargetDimension>`);
      i(3, `<Method>${esc(t.method)}</Method>`);
      if (t.notes) i(3, `<Notes>${esc(t.notes)}</Notes>`);
      i(2, '</Rule>');
    }
    i(1, '</TransformationRules>');
    i(0, '');
  }

  // ─── DATA LOAD RULES ──────────────────────────────────────────────────────
  const loadRules = lr.loadRules || [];
  if (loadRules.length) {
    i(1, '<DataLoadRules>');
    for (const r of loadRules) {
      i(2, '<LoadRule>');
      i(3, `<Name>${esc(r.name)}</Name>`);
      i(3, `<DataSource>${esc(r.source)}</DataSource>`);
      i(3, `<TargetCube>${esc(r.cube)}</TargetCube>`);
      i(3, `<TargetScenario>${esc(r.scenario)}</TargetScenario>`);
      i(3, `<LoadMethod>${esc(r.method)}</LoadMethod>`);
      if (r.clearFirst) i(3, `<ClearBeforeLoad>${esc(r.clearFirst)}</ClearBeforeLoad>`);
      i(2, '</LoadRule>');
    }
    i(1, '</DataLoadRules>');
    i(0, '');
  }

  // ─── WORKFLOW PROFILES ────────────────────────────────────────────────────
  const workflows = wf.workflows || [];
  if (workflows.length) {
    i(1, '<WorkflowProfiles>');
    for (const w of workflows) {
      i(2, '<WorkflowProfile>');
      i(3, `<Name>${esc(w.name)}</Name>`);
      i(3, `<Frequency>${esc(w.frequency)}</Frequency>`);
      i(3, `<Scenario>${esc(w.scenario)}</Scenario>`);
      if (w.granularity) i(3, `<Granularity>${esc(w.granularity)}</Granularity>`);
      if (w.steps)       i(3, `<WorkflowSteps>${esc(w.steps)}</WorkflowSteps>`);
      i(2, '</WorkflowProfile>');
    }
    i(1, '</WorkflowProfiles>');
    i(0, '');
  }

  // ─── CERTIFICATIONS ───────────────────────────────────────────────────────
  const certifications = cert.certifications || [];
  if (certifications.length) {
    i(1, '<Certifications>');
    for (const c of certifications) {
      i(2, '<Certification>');
      i(3, `<Name>${esc(c.name)}</Name>`);
      i(3, `<Type>${esc(c.type)}</Type>`);
      i(3, `<OwnerGroup>${esc(c.owner)}</OwnerGroup>`);
      i(3, `<Frequency>${esc(c.freq)}</Frequency>`);
      if (c.dueDay) i(3, `<DueDayOfMonth>${esc(c.dueDay)}</DueDayOfMonth>`);
      i(2, '</Certification>');
    }
    i(1, '</Certifications>');
    i(0, '');
  }

  // ─── DATA COLLECTION TEMPLATES ────────────────────────────────────────────
  const templates = tmpl.templates || [];
  if (templates.length) {
    i(1, '<DataCollectionTemplates>');
    for (const t of templates) {
      i(2, '<Template>');
      i(3, `<Name>${esc(t.name)}</Name>`);
      i(3, `<Scenario>${esc(t.scenario)}</Scenario>`);
      i(3, `<Type>${esc(t.type)}</Type>`);
      i(3, `<TargetCube>${esc(t.cube)}</TargetCube>`);
      if (t.inputLevel) i(3, `<InputLevel>${esc(t.inputLevel)}</InputLevel>`);
      i(2, '</Template>');
    }
    i(1, '</DataCollectionTemplates>');
    i(0, '');
  }

  // ─── USER GROUPS ──────────────────────────────────────────────────────────
  const groups = ug.groups || [];
  if (groups.length) {
    i(1, '<UserGroups>');
    for (const g of groups) {
      i(2, '<UserGroup>');
      i(3, `<Name>${esc(g.name)}</Name>`);
      i(3, `<GroupType>${esc(g.type)}</GroupType>`);
      if (g.adminLevel) i(3, `<AdminLevel>${esc(g.adminLevel)}</AdminLevel>`);
      if (g.desc)       i(3, `<Description>${esc(g.desc)}</Description>`);
      i(2, '</UserGroup>');
    }
    i(1, '</UserGroups>');
    i(0, '');
  }

  // ─── ROLE ASSIGNMENTS ─────────────────────────────────────────────────────
  const roles = rol.roles || [];
  if (roles.length) {
    i(1, '<RoleAssignments>');
    for (const r of roles) {
      i(2, '<RoleAssignment>');
      i(3, `<UserGroup>${esc(r.group)}</UserGroup>`);
      i(3, `<ObjectType>${esc(r.object)}</ObjectType>`);
      i(3, `<ObjectName>${esc(r.name)}</ObjectName>`);
      i(3, `<Permission>${esc(r.permission)}</Permission>`);
      i(2, '</RoleAssignment>');
    }
    i(1, '</RoleAssignments>');
    i(0, '');
  }

  // ─── WORKFLOW SECURITY ────────────────────────────────────────────────────
  const wfSec = wfs.wfSec || [];
  if (wfSec.length) {
    i(1, '<WorkflowSecurity>');
    for (const w of wfSec) {
      i(2, '<WorkflowSecurityRule>');
      i(3, `<Workflow>${esc(w.workflow)}</Workflow>`);
      i(3, `<UserGroup>${esc(w.group)}</UserGroup>`);
      i(3, `<WorkflowRole>${esc(w.role)}</WorkflowRole>`);
      if (w.scope) i(3, `<Scope>${esc(w.scope)}</Scope>`);
      i(2, '</WorkflowSecurityRule>');
    }
    i(1, '</WorkflowSecurity>');
    i(0, '');
  }

  i(0, '</OneStreamApplication>');
  return lines.join('\n');
}
