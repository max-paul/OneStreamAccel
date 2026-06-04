import { PHASES, STEPS, STEP_ORDER } from '../data/constants';
import { getStepStatus } from '../utils/completion';

export default function Sidebar({ project, view, onNavigate, doneCount, completion }) {
  return (
    <nav className="sidebar">
      <div className="sidebar-header">
        <div className="logo">OS<span> Accelerator</span></div>
        <div className="project-name">{project.name || 'Unnamed project'}</div>
      </div>

      <div style={{ padding: '0.5rem 0' }}>
        <div className={`nav-item ${view === 'overview' ? 'active' : ''}`} onClick={() => onNavigate('overview')}>
          <i className="ti ti-layout-dashboard" style={{ fontSize: '14px', color: 'var(--text3)' }} />
          Overview
        </div>
        <div className={`nav-item ${view === 'output' ? 'active' : ''}`} onClick={() => onNavigate('output')}>
          <i className="ti ti-code" style={{ fontSize: '14px', color: 'var(--text3)' }} />
          Export output
        </div>
      </div>

      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '0.5rem' }} />

      {PHASES.map((phase) => (
        <div key={phase.id} className="phase-group">
          <div className="phase-label">{phase.label}</div>
          {phase.steps.map((stepId) => {
            const status = getStepStatus(project, stepId);
            const isActive = view === stepId;
            return (
              <div
                key={stepId}
                className={`nav-item ${isActive ? 'active' : ''}`}
                onClick={() => onNavigate(stepId)}
              >
                <div className={`nav-dot ${status === 'done' ? 'done' : ''} ${isActive && status !== 'done' ? 'active' : ''}`} />
                {STEPS[stepId].label}
              </div>
            );
          })}
        </div>
      ))}

      <div className="sidebar-footer">
        <div className="progress-label">
          <span>{doneCount} / {STEP_ORDER.length} steps</span>
          <span>{completion}%</span>
        </div>
        <div className="progress-bar-wrap">
          <div className="progress-bar-fill" style={{ width: `${completion}%` }} />
        </div>
      </div>
    </nav>
  );
}
