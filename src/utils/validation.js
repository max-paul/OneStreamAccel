// Required scalar fields per step (must be non-empty strings)
const REQUIRED_SCALAR = {
  'app-props':    [['name', 'Application Name'], ['appId', 'Application ID']],
  'time-profile': [['startYear', 'Start Year'], ['endYear', 'End Year'], ['frequency', 'Period Frequency'], ['fyEnd', 'Fiscal Year End'], ['periods', 'Number of Periods']],
  'entity':       [['topEntity', 'Top-Level Entity Name']],
};

// Steps that require at least one table row
const REQUIRED_TABLE = {
  'scenario':   ['scenarios',    'at least one scenario (Actual is required)'],
  'currency':   ['currencies',   'at least one currency'],
  'entity':     ['entities',     'at least one entity member'],
  'accounts':   ['accounts',     'at least one account member'],
  'cube-props': ['cubes',        'at least one cube'],
  'user-groups':['groups',       'at least one user group'],
};

// Soft warnings (don't block but show amber indicator)
const RECOMMENDED = {
  'flow-dim':    [['flows', 'Flow members should be defined for balance sheet accounts']],
  'cube-dims':   [['cubeDims', 'Cube dimension bindings should be defined for each cube']],
  'load-rules':  [['loadRules', 'At least one load rule should be defined']],
  'workflow':    [['workflows', 'At least one workflow profile should be defined']],
  'roles':       [['roles', 'Role assignments should be defined for each user group']],
};

export function validateStep(stepId, data) {
  const errors = [];

  const requiredScalars = REQUIRED_SCALAR[stepId] || [];
  for (const [field, label] of requiredScalars) {
    const val = data?.[field];
    if (!val || !String(val).trim()) {
      errors.push(`${label} is required.`);
    }
  }

  const tableRequirement = REQUIRED_TABLE[stepId];
  if (tableRequirement) {
    const [key, msg] = tableRequirement;
    const rows = data?.[key] || [];
    if (rows.length === 0) {
      errors.push(`This step requires ${msg}.`);
    }
  }

  // Year range validation
  if (stepId === 'time-profile' && data?.startYear && data?.endYear) {
    const start = parseInt(data.startYear, 10);
    const end   = parseInt(data.endYear, 10);
    if (!isNaN(start) && !isNaN(end) && end <= start) {
      errors.push('End Year must be greater than Start Year.');
    }
    if (!isNaN(start) && start < 2000) {
      errors.push('Start Year should be 2000 or later.');
    }
    if (!isNaN(end) && end > 2060) {
      errors.push('End Year should not exceed 2060.');
    }
  }

  // Application ID format validation
  if (stepId === 'app-props' && data?.appId) {
    const id = data.appId;
    if (!/^[A-Za-z0-9_]+$/.test(id)) {
      errors.push('Application ID must contain only letters, numbers, and underscores (no spaces or special characters).');
    }
  }

  return errors;
}

export function getStepWarnings(stepId, data) {
  const warnings = [];
  const recommended = RECOMMENDED[stepId] || [];
  for (const [key, msg] of recommended) {
    const val = data?.[key];
    const isEmpty = !val || (Array.isArray(val) ? val.length === 0 : !String(val).trim());
    if (isEmpty) {
      warnings.push(msg);
    }
  }
  return warnings;
}

// Returns 'done' | 'warning' | 'empty'
export function getEnhancedStepStatus(project, stepId) {
  const data = project?.steps?.[stepId];
  if (!data) return 'empty';

  const hasAnyData = Object.values(data).some(
    (v) => v && (Array.isArray(v) ? v.length > 0 : String(v).trim())
  );
  if (!hasAnyData) return 'empty';

  const errors = validateStep(stepId, data);
  if (errors.length > 0) return 'warning';

  return 'done';
}
