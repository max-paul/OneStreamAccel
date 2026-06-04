import { STEP_ORDER, STEPS } from '../data/constants';
import { validateStep } from './validation';
import { isStepDefaultData } from './stepDefaults';

/**
 * Per-step readiness status:
 *
 *   'blocked'            — required step with no valid data. Export cannot proceed.
 *   'invalid'            — optional step has data but fails validation.
 *   'unreviewed-empty'   — required step is empty AND user never visited it.
 *   'unreviewed-defaults'— step has data that exactly matches shipped defaults AND user never touched it.
 *   'unreviewed-valid'   — step has non-default valid data but user never visited it.
 *   'confirm-defaults'   — user visited the step but never changed anything from defaults.
 *   'skipped'            — optional step, not filled in, and not required.
 *   'ready'              — touched, valid, and data is not identical to defaults (or user accepted).
 */
export function getStepReadiness(project, stepId) {
  const data      = project.steps?.[stepId];
  const touched   = (project.touchedSteps || []).includes(stepId);
  const stepMeta  = STEPS[stepId];
  const isRequired= stepMeta?.required === true;
  const errors    = validateStep(stepId, data);
  const hasErrors = errors.length > 0;

  const hasData = data && Object.values(data).some(
    v => v && (Array.isArray(v) ? v.length > 0 : String(v).trim())
  );

  // No data at all
  if (!hasData) {
    if (isRequired) return 'blocked';
    return 'skipped';
  }

  // Has data but fails validation
  if (hasErrors) {
    if (isRequired) return 'blocked';
    return 'invalid';
  }

  // Valid data — now check touch/default state
  const isDefault = isStepDefaultData(stepId, data);

  if (!touched) {
    // User never visited this step
    if (isDefault) return 'unreviewed-defaults'; // valid but definitely defaults, not reviewed
    return 'unreviewed-valid';                   // valid non-default data but not visited
  }

  // Touched: user visited this step
  if (isDefault) return 'confirm-defaults'; // visited but never changed a single value

  return 'ready';
}

/** Aggregate readiness across all steps. */
export function getExportReadiness(project) {
  const statuses = {};
  for (const stepId of STEP_ORDER) {
    statuses[stepId] = getStepReadiness(project, stepId);
  }

  // Steps that fully block export
  const blocked = STEP_ORDER.filter(id =>
    statuses[id] === 'blocked'
  );

  // Steps that need explicit user confirmation before export
  const needsConfirmation = STEP_ORDER.filter(id =>
    statuses[id] === 'unreviewed-defaults' || statuses[id] === 'confirm-defaults'
  );

  // Steps with valid non-default data that weren't explicitly visited
  // (these pass through automatically per the product requirement)
  const passThrough = STEP_ORDER.filter(id =>
    statuses[id] === 'unreviewed-valid'
  );

  const ready = STEP_ORDER.filter(id =>
    statuses[id] === 'ready' || statuses[id] === 'skipped' || statuses[id] === 'unreviewed-valid'
  );

  return {
    statuses,
    blocked,
    needsConfirmation,
    passThrough,
    ready,
    canExport:           blocked.length === 0,
    needsDefaultReview:  needsConfirmation.length > 0,
  };
}
