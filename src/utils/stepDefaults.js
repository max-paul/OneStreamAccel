/**
 * Known pre-populated default data for steps that ship with example rows.
 * Used to detect whether a user has actually reviewed/changed the values
 * or whether they're just the shipped defaults.
 *
 * Only steps that have DEFAULT_ROWS in their components are listed here.
 */
export const STEP_DEFAULTS = {
  'scenario': {
    scenarios: [
      { id: 'Actual',   name: 'Actual',   type: 'Actual',   lock: 'Period', defaultView: 'Periodic', icpEnabled: 'Yes',  desc: 'Historical actuals loaded from ERP / GL systems' },
      { id: 'Budget',   name: 'Budget',   type: 'Budget',   lock: 'Year',   defaultView: 'YTD',      icpEnabled: 'No',   desc: 'Annual operating budget / plan' },
      { id: 'Forecast', name: 'Forecast', type: 'Forecast', lock: 'No',     defaultView: 'YTD',      icpEnabled: 'No',   desc: 'Rolling forecast — updated each close period' },
    ],
  },

  'currency': {
    currencies: [{ code: 'USD', name: 'US Dollar', default: 'Yes' }],
  },

  'flow-dim': {
    flows: [
      { name: 'OPEN_BAL',    displayName: 'Opening Balance',          type: 'Balance',    translation: 'Opening Rate',              desc: 'Balance at start of period — equals prior period closing balance' },
      { name: 'ACQUISITIONS',displayName: 'Acquisitions / Additions', type: 'Flow',       translation: 'Average Rate',              desc: 'New assets purchased, investments made, or new debt drawn down' },
      { name: 'DISPOSALS',   displayName: 'Disposals / Reductions',   type: 'Flow',       translation: 'Average Rate',              desc: 'Assets sold, investments disposed of, or debt repaid' },
      { name: 'FX_MOVEMENT', displayName: 'FX Translation Movement',  type: 'Flow',       translation: 'No Translation',            desc: 'FX retranslation difference — calculated automatically during consolidation' },
      { name: 'OTHER_MOVES', displayName: 'Other Movements',          type: 'Flow',       translation: 'Average Rate',              desc: 'Reclassifications, adjustments, and other movements not covered above' },
      { name: 'CLOSE_BAL',   displayName: 'Closing Balance',          type: 'Calculated', translation: 'Period End (Closing Rate)', desc: 'Calculated: Opening + all movement members' },
    ],
  },

  'user-groups': {
    groups: [
      { name: 'GRP_SYS_ADMIN',      type: 'System Administrator',      adminLevel: 'Full System Admin',  desc: 'IT Platform Administrators — 2–3 named individuals only. IT Finance or IT Infrastructure team.' },
      { name: 'GRP_CONFIGURATOR',   type: 'Application Administrator',  adminLevel: 'Application Admin',  desc: 'Finance Systems team — configure metadata, rules, reports. Typically 3–5 people in Finance IT.' },
      { name: 'GRP_CORP_FINANCE',   type: 'Process Owner',              adminLevel: 'None',               desc: 'Group Corporate Finance — CFO, Group Controller, FP&A Director. Full read/write, all entities.' },
      { name: 'GRP_ENTITY_FINANCE', type: 'Standard User',              adminLevel: 'None',               desc: 'Entity-level Finance teams — data entry and submission for assigned entities only.' },
      { name: 'GRP_READ_ONLY',      type: 'Read Only / Executive',      adminLevel: 'None',               desc: 'Senior Management, Board Members, Investors. Read-only dashboards and reports.' },
    ],
  },
};

/** Returns true if the step's current saved data exactly matches the shipped defaults. */
export function isStepDefaultData(stepId, data) {
  const defaults = STEP_DEFAULTS[stepId];
  if (!defaults || !data) return false;
  return JSON.stringify(data) === JSON.stringify(defaults);
}

/** Human-readable summary of current step data for the confirmation UI. */
export function getDefaultSummary(stepId, data) {
  if (!data) return null;
  switch (stepId) {
    case 'scenario':
      return (data.scenarios || []).map(s => `${s.name || s.id} (${s.type}, lock: ${s.lock})`).join(' · ');
    case 'currency':
      return (data.currencies || []).map(c => `${c.code}${c.default === 'Yes' ? ' (reporting)' : ''}`).join(', ');
    case 'flow-dim':
      return (data.flows || []).map(f => f.name || f.displayName).join(' → ');
    case 'user-groups':
      return (data.groups || []).map(g => g.name).join(', ');
    default:
      return null;
  }
}
