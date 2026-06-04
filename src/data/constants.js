export const PHASES = [
  { id: 'p1', label: 'Foundation',          color: 'var(--phase1)', steps: ['app-props', 'time-profile', 'scenario', 'currency'] },
  { id: 'p2', label: 'Dimensions',           color: 'var(--phase2)', steps: ['entity', 'accounts', 'flow-dim', 'ud-dims'] },
  { id: 'p3', label: 'Cube Design',          color: 'var(--phase3)', steps: ['cube-props', 'cube-dims'] },
  { id: 'p4', label: 'Data & Integration',   color: 'var(--phase4)', steps: ['data-source', 'transform', 'load-rules'] },
  { id: 'p5', label: 'Workflow & Process',   color: 'var(--phase5)', steps: ['workflow', 'certification', 'templates'] },
  { id: 'p6', label: 'Security',             color: 'var(--phase6)', steps: ['user-groups', 'roles', 'workflow-sec'] },
];

export const STEPS = {
  'app-props':    { phase: 'p1', label: 'Application properties',      icon: 'ti-building' },
  'time-profile': { phase: 'p1', label: 'Time profile',                icon: 'ti-calendar' },
  'scenario':     { phase: 'p1', label: 'Scenario setup',              icon: 'ti-layers-difference' },
  'currency':     { phase: 'p1', label: 'Currency setup',              icon: 'ti-currency-dollar' },
  'entity':       { phase: 'p2', label: 'Entity hierarchy',            icon: 'ti-sitemap' },
  'accounts':     { phase: 'p2', label: 'Account structure',           icon: 'ti-list-details' },
  'flow-dim':     { phase: 'p2', label: 'Flow dimension',              icon: 'ti-arrows-exchange' },
  'ud-dims':      { phase: 'p2', label: 'UD1–UD8 dimensions',          icon: 'ti-tag' },
  'cube-props':   { phase: 'p3', label: 'Cube properties',             icon: 'ti-box' },
  'cube-dims':    { phase: 'p3', label: 'Cube dimensions',             icon: 'ti-grid-dots' },
  'data-source':  { phase: 'p4', label: 'Data source setup',           icon: 'ti-database' },
  'transform':    { phase: 'p4', label: 'Transformation rules',        icon: 'ti-transform' },
  'load-rules':   { phase: 'p4', label: 'Data load rules',             icon: 'ti-upload' },
  'workflow':     { phase: 'p5', label: 'Workflow profiles',           icon: 'ti-workflow' },
  'certification':{ phase: 'p5', label: 'Certification setup',         icon: 'ti-certificate' },
  'templates':    { phase: 'p5', label: 'Data collection templates',   icon: 'ti-template' },
  'user-groups':  { phase: 'p6', label: 'User groups',                 icon: 'ti-users-group' },
  'roles':        { phase: 'p6', label: 'Role assignments',            icon: 'ti-shield-check' },
  'workflow-sec': { phase: 'p6', label: 'Workflow security',           icon: 'ti-lock' },
};

export const STEP_ORDER = Object.keys(STEPS);
