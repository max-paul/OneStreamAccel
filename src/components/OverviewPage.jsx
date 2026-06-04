import { PHASES, STEPS, STEP_ORDER } from '../data/constants';
import { getStepStatus } from '../utils/completion';

export default function OverviewPage({ project, completion, doneCount, onNavigate, onDownloadJSON, onImport, onReset }) {
  const nextStep = STEP_ORDER.find((k) => getStepStatus(project, k) === 'empty');

  return (
    <div>
      <div className="page-header">
        <div className="breadcrumb">Project overview</div>
        <div className="page-title">{project.name || 'Your OneStream App'}</div>
        <div className="page-subtitle">
          {project.client ? `Client: ${project.client}` : 'Track configuration progress across all phases.'}
        </div>
      </div>

      <div className="overview-grid">
        <div className="stat-card">
          <div className="stat-label">Completion</div>
          <div className="stat-val">{completion}%</div>
          <div className="stat-sub">{doneCount} of {STEP_ORDER.length} steps done</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Phases</div>
          <div className="stat-val">{PHASES.length}</div>
          <div className="stat-sub">Foundation → Security</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Last updated</div>
          <div className="stat-val" style={{ fontSize: '18px' }}>
            {project.updatedAt ? new Date(project.updatedAt).toLocaleDateString() : 'Never'}
          </div>
          <div className="stat-sub">
            {project.updatedAt ? new Date(project.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}
          </div>
        </div>
      </div>

      {nextStep && (
        <div className="next-banner">
          <div>
            <div style={{ fontSize: '11px', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '3px' }}>
              Continue where you left off
            </div>
            <div style={{ fontSize: '14px', fontWeight: '500' }}>{STEPS[nextStep]?.label}</div>
          </div>
          <button className="btn btn-primary" onClick={() => onNavigate(nextStep)}>
            Continue
            <i className="ti ti-arrow-right" />
          </button>
        </div>
      )}

      <div className="phase-cards">
        {PHASES.map((phase) => {
          const stepsDone = phase.steps.filter((k) => getStepStatus(project, k) === 'done').length;
          const pct = Math.round((stepsDone / phase.steps.length) * 100);
          return (
            <div key={phase.id} className="phase-card" onClick={() => onNavigate(phase.steps[0])}>
              <div className="phase-card-header">
                <span
                  className="phase-badge"
                  style={{ background: `color-mix(in srgb, ${phase.color} 15%, transparent)`, color: phase.color }}
                >
                  {phase.label}
                </span>
                <span style={{ fontSize: '13px', color: 'var(--text3)' }}>{stepsDone}/{phase.steps.length}</span>
              </div>
              <div className="phase-card-steps">{phase.steps.map((k) => STEPS[k]?.label).join(' · ')}</div>
              <div className="phase-progress">
                <div className="phase-progress-fill" style={{ width: `${pct}%`, background: phase.color }} />
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ display: 'flex', gap: '10px', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)' }}>
        <button className="btn btn-ghost" onClick={onDownloadJSON}>
          <i className="ti ti-download" />
          Save project file
        </button>
        <button className="btn btn-ghost" onClick={onImport}>
          <i className="ti ti-upload" />
          Load project file
        </button>
        <button className="btn btn-warning" onClick={onReset}>
          <i className="ti ti-refresh" />
          New project
        </button>
      </div>
    </div>
  );
}
