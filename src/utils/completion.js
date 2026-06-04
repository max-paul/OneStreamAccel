import { STEP_ORDER } from '../data/constants';

export function getCompletion(project) {
  if (!project) return 0;
  const filled = STEP_ORDER.filter((k) => {
    const d = project.steps?.[k];
    if (!d) return false;
    return Object.values(d).some((v) => v && (Array.isArray(v) ? v.length > 0 : String(v).trim()));
  });
  return Math.round((filled.length / STEP_ORDER.length) * 100);
}

export function getStepStatus(project, stepId) {
  const d = project?.steps?.[stepId];
  if (!d) return 'empty';
  const vals = Object.values(d).filter((v) => v && (Array.isArray(v) ? v.length > 0 : String(v).trim()));
  return vals.length > 0 ? 'done' : 'empty';
}
