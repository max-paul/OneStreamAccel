import { STEP_ORDER } from '../data/constants';
import { getEnhancedStepStatus } from './validation';

export function getCompletion(project) {
  if (!project) return 0;
  const done = STEP_ORDER.filter((k) => getEnhancedStepStatus(project, k) === 'done').length;
  return Math.round((done / STEP_ORDER.length) * 100);
}

// Kept for backward compatibility — use getEnhancedStepStatus from validation.js for new code
export function getStepStatus(project, stepId) {
  return getEnhancedStepStatus(project, stepId);
}
