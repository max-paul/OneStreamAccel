import { useState } from 'react';
import { STEP_ORDER, STEPS, PHASES } from '../data/constants';
import { getExportReadiness } from '../utils/exportReadiness';
import { getDefaultSummary } from '../utils/stepDefaults';

const STATUS_CONFIG = {
  'blocked': {
    icon:  'ti-circle-x',
    color: 'var(--danger)',
    bg:    'rgba(239,68,68,0.07)',
    border:'rgba(239,68,68,0.22)',
    label: 'Incomplete — required',
  },
  'invalid': {
    icon:  'ti-alert-triangle',
    color: 'var(--warning)',
    bg:    'rgba(245,158,11,0.07)',
    border:'rgba(245,158,11,0.22)',
    label: 'Has errors',
  },
  'unreviewed-defaults': {
    icon:  'ti-eye-question',
    color: 'var(--warning)',
    bg:    'rgba(245,158,11,0.07)',
    border:'rgba(245,158,11,0.22)',
    label: 'Default values — not reviewed',
  },
  'confirm-defaults': {
    icon:  'ti-eye-question',
    color: 'var(--warning)',
    bg:    'rgba(245,158,11,0.07)',
    border:'rgba(245,158,11,0.22)',
    label: 'Visited but unchanged from defaults',
  },
  'unreviewed-valid': {
    icon:  'ti-circle-check',
    color: '#6ab7f5',
    bg:    'rgba(79,142,247,0.05)',
    border:'rgba(79,142,247,0.18)',
    label: 'Valid — passing through',
  },
  'ready': {
    icon:  'ti-circle-check',
    color: 'var(--success)',
    bg:    'rgba(34,197,94,0.06)',
    border:'rgba(34,197,94,0.18)',
    label: 'Reviewed and ready',
  },
  'skipped': {
    icon:  'ti-minus',
    color: 'var(--text3)',
    bg:    'transparent',
    border:'transparent',
    label: 'Optional — not configured',
  },
};

function PhaseLabel({ phaseId }) {
  const phase = PHASES.find(p => p.id === phaseId);
  if (!phase) return null;
  return (
    <span style={{
      fontSize: '9px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px',
      padding: '1px 6px', borderRadius: '99px',
      background: `color-mix(in srgb, ${phase.color} 15%, transparent)`,
      color: phase.color, marginLeft: '6px',
    }}>
      {phase.label}
    </span>
  );
}

function StepRow({ stepId, status, data, confirmed, onConfirm, onNavigate }) {
  const cfg      = STATUS_CONFIG[status] || STATUS_CONFIG['skipped'];
  const stepMeta = STEPS[stepId];
  const needsConfirm  = status === 'unreviewed-defaults' || status === 'confirm-defaults';
  const summary  = needsConfirm ? getDefaultSummary(stepId, data) : null;

  if (status === 'skipped') return null; // don't render optional empty steps

  return (
    <div style={{
      background: confirmed ? 'rgba(34,197,94,0.06)' : cfg.bg,
      border: `1px solid ${confirmed ? 'rgba(34,197,94,0.22)' : cfg.border}`,
      borderRadius: 'var(--radius)',
      padding: '0.75rem 1rem',
      marginBottom: '6px',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
        {/* Status icon */}
        <i
          className={`ti ${confirmed ? 'ti-circle-check' : cfg.icon}`}
          style={{
            color: confirmed ? 'var(--success)' : cfg.color,
            fontSize: '16px',
            marginTop: '1px',
            flexShrink: 0,
          }}
        />

        <div style={{ flex: 1 }}>
          {/* Step name + phase badge */}
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2px' }}>
            <span style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text)' }}>
              {stepMeta?.label}
            </span>
            <PhaseLabel phaseId={stepMeta?.phase} />
          </div>

          {/* Status label */}
          <div style={{ fontSize: '11.5px', color: confirmed ? 'var(--success)' : cfg.color }}>
            {confirmed ? 'Confirmed — values accepted' : cfg.label}
          </div>

          {/* Default values summary */}
          {needsConfirm && !confirmed && summary && (
            <div style={{
              marginTop: '8px',
              background: 'var(--bg3)',
              borderRadius: '6px',
              padding: '6px 10px',
              fontSize: '11.5px',
              color: 'var(--text2)',
              fontFamily: "'DM Mono', monospace",
              lineHeight: '1.6',
            }}>
              {summary}
            </div>
          )}

          {/* Confirm checkbox for default-value steps */}
          {needsConfirm && !confirmed && (
            <label style={{
              display: 'flex', alignItems: 'flex-start', gap: '8px', marginTop: '10px',
              cursor: 'pointer',
            }}>
              <input
                type="checkbox"
                style={{ marginTop: '2px', cursor: 'pointer', accentColor: 'var(--accent)', flexShrink: 0 }}
                onChange={(e) => e.target.checked && onConfirm(stepId)}
              />
              <span style={{ fontSize: '12px', color: 'var(--text2)', lineHeight: '1.55' }}>
                I have reviewed these values and confirm they are correct for this implementation.
              </span>
            </label>
          )}
        </div>

        {/* "Go configure" button for blocked / invalid steps */}
        {(status === 'blocked' || status === 'invalid') && (
          <button
            className="btn btn-ghost"
            style={{ fontSize: '11px', padding: '0.3rem 0.75rem', flexShrink: 0 }}
            onClick={() => onNavigate(stepId)}
          >
            Configure
            <i className="ti ti-arrow-right" style={{ fontSize: '11px' }} />
          </button>
        )}
      </div>
    </div>
  );
}

/**
 * ExportReadiness — shows the full per-step readiness gate.
 *
 * Props:
 *   project         — current project state
 *   onNavigate      — fn(stepId) to jump to a specific step
 *   confirmedSteps  — Set of stepIds the user has explicitly confirmed
 *   onConfirm       — fn(stepId) to add a step to the confirmed set
 */
export default function ExportReadiness({ project, onNavigate, confirmedSteps, onConfirm }) {
  const { statuses, blocked, needsConfirmation, passThrough } = getExportReadiness(project);

  const pendingConfirmations = needsConfirmation.filter(id => !confirmedSteps.has(id));
  const allClear = blocked.length === 0 && pendingConfirmations.length === 0;

  // Separate steps into display groups — skip skipped optional steps
  const displaySteps = STEP_ORDER.filter(id => statuses[id] !== 'skipped');

  return (
    <div style={{ marginBottom: '1.5rem' }}>

      {/* Overall status banner */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: allClear ? 'rgba(34,197,94,0.08)' : blocked.length > 0 ? 'rgba(239,68,68,0.08)' : 'rgba(245,158,11,0.08)',
        border: `1px solid ${allClear ? 'rgba(34,197,94,0.25)' : blocked.length > 0 ? 'rgba(239,68,68,0.25)' : 'rgba(245,158,11,0.25)'}`,
        borderRadius: 'var(--radius-lg)',
        padding: '1rem 1.25rem',
        marginBottom: '1.25rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <i
            className={`ti ${allClear ? 'ti-circle-check' : blocked.length > 0 ? 'ti-circle-x' : 'ti-alert-triangle'}`}
            style={{
              fontSize: '20px',
              color: allClear ? 'var(--success)' : blocked.length > 0 ? 'var(--danger)' : 'var(--warning)',
            }}
          />
          <div>
            <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text)', marginBottom: '2px' }}>
              {allClear
                ? 'All steps reviewed — ready to export'
                : blocked.length > 0
                  ? `${blocked.length} required step${blocked.length > 1 ? 's' : ''} incomplete`
                  : `${pendingConfirmations.length} step${pendingConfirmations.length > 1 ? 's' : ''} need${pendingConfirmations.length === 1 ? 's' : ''} review before exporting`
              }
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text3)' }}>
              {allClear
                ? 'All import files are ready for download below.'
                : blocked.length > 0
                  ? 'Complete the required steps, then return here to export.'
                  : 'The steps below contain unreviewed default values. Confirm they are correct for your implementation.'
              }
            </div>
          </div>
        </div>

        {/* Summary chips */}
        <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
          {blocked.length > 0 && (
            <span style={{ fontSize: '11px', fontWeight: '600', padding: '3px 10px', borderRadius: '99px', background: 'rgba(239,68,68,0.15)', color: 'var(--danger)' }}>
              {blocked.length} blocked
            </span>
          )}
          {pendingConfirmations.length > 0 && (
            <span style={{ fontSize: '11px', fontWeight: '600', padding: '3px 10px', borderRadius: '99px', background: 'rgba(245,158,11,0.15)', color: 'var(--warning)' }}>
              {pendingConfirmations.length} to confirm
            </span>
          )}
          {passThrough.length > 0 && (
            <span style={{ fontSize: '11px', fontWeight: '600', padding: '3px 10px', borderRadius: '99px', background: 'rgba(79,142,247,0.12)', color: 'var(--accent)' }}>
              {passThrough.length} passing through
            </span>
          )}
        </div>
      </div>

      {/* Pass-through info box */}
      {passThrough.length > 0 && (
        <div style={{
          background: 'rgba(79,142,247,0.06)', border: '1px solid rgba(79,142,247,0.18)',
          borderRadius: 'var(--radius)', padding: '0.75rem 1rem', marginBottom: '1rem',
          fontSize: '12px', color: 'var(--text2)', lineHeight: '1.6',
        }}>
          <i className="ti ti-info-circle" style={{ color: 'var(--accent)', marginRight: '7px' }} />
          <strong>Passing through automatically:</strong> {passThrough.map(id => STEPS[id]?.label).join(', ')} — these steps contain valid, non-default data you configured. They don't require explicit confirmation.
        </div>
      )}

      {/* Step-by-step rows — only show steps that aren't 'skipped' */}
      <div>
        {displaySteps.map(stepId => (
          <StepRow
            key={stepId}
            stepId={stepId}
            status={statuses[stepId]}
            data={project.steps?.[stepId]}
            confirmed={confirmedSteps.has(stepId)}
            onConfirm={onConfirm}
            onNavigate={onNavigate}
          />
        ))}
      </div>
    </div>
  );
}
