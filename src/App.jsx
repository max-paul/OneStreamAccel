import { useState, useRef } from 'react';
import { useProject } from './hooks/useProject';
import { getCompletion } from './utils/completion';
import { getEnhancedStepStatus, validateStep } from './utils/validation';
import { downloadJSON, downloadXML } from './utils/download';
import { PHASES, STEPS, STEP_ORDER } from './data/constants';
import { STEP_COMPONENTS } from './components/steps';
import Sidebar from './components/Sidebar';
import OverviewPage from './components/OverviewPage';
import OutputPage from './components/OutputPage';
import SetupScreen from './components/SetupScreen';

export default function App() {
  const { project, save, loaded } = useProject();
  const [view, setView]           = useState('overview');
  const [savedMsg, setSavedMsg]   = useState(false);
  const [outputTab, setOutputTab] = useState('human');
  const [stepErrors, setStepErrors] = useState([]);
  const fileInputRef              = useRef(null);

  if (!loaded) {
    return <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text3)' }}>Loading...</div>;
  }
  if (!project) {
    return <SetupScreen onCreate={save} />;
  }

  const updateStep = (stepId, data) => {
    const updated = {
      ...project,
      steps: { ...(project.steps || {}), [stepId]: data },
      updatedAt: new Date().toISOString(),
    };
    save(updated);
    setStepErrors([]);
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 2000);
  };

  const navToNext = (currentId) => {
    const errors = validateStep(currentId, project.steps?.[currentId]);
    if (errors.length > 0) {
      setStepErrors(errors);
      return;
    }
    setStepErrors([]);
    const idx = STEP_ORDER.indexOf(currentId);
    if (idx < STEP_ORDER.length - 1) setView(STEP_ORDER[idx + 1]);
    else setView('overview');
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        save(data);
        setView('overview');
      } catch (_) {
        alert('Invalid project file. Please select a valid OneStream Accelerator .json file.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const completion = getCompletion(project);
  const doneCount  = STEP_ORDER.filter((k) => getEnhancedStepStatus(project, k) === 'done').length;

  const renderMain = () => {
    if (view === 'overview') {
      return (
        <OverviewPage
          project={project}
          completion={completion}
          doneCount={doneCount}
          onNavigate={setView}
          onDownloadJSON={() => downloadJSON(project)}
          onImport={() => fileInputRef.current?.click()}
          onReset={() => {
            if (confirm('Start a new project? All current data will be cleared.')) {
              save(null);
              setView('overview');
            }
          }}
        />
      );
    }

    if (view === 'output') {
      return (
        <OutputPage
          project={project}
          outputTab={outputTab}
          setOutputTab={setOutputTab}
          onDownloadXML={() => downloadXML(project)}
          onDownloadJSON={() => downloadJSON(project)}
        />
      );
    }

    if (STEPS[view]) {
      const StepComp = STEP_COMPONENTS[view];
      const stepInfo = STEPS[view];
      const phase    = PHASES.find((p) => p.id === stepInfo.phase);

      return (
        <div>
          <div className="page-header">
            <div className="breadcrumb">{phase?.label} → {stepInfo.label}</div>
            <div className="page-title">{stepInfo.label}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '6px' }}>
              <span
                className="step-phase-badge"
                style={{ background: `color-mix(in srgb, ${phase?.color} 15%, transparent)`, color: phase?.color }}
              >
                {phase?.label}
              </span>
              {stepInfo.required && (
                <span style={{ fontSize: '11px', color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <i className="ti ti-asterisk" style={{ fontSize: '10px' }} />
                  Required for completion
                </span>
              )}
            </div>
            <div className="page-subtitle" style={{ marginTop: '8px' }}>{stepInfo.description}</div>
          </div>

          <StepComp
            data={project.steps?.[view]}
            onChange={(data) => updateStep(view, data)}
          />

          {stepErrors.length > 0 && (
            <div className="validation-errors">
              <div className="validation-errors-title">
                <i className="ti ti-alert-circle" />
                Please fix the following before continuing:
              </div>
              <ul>
                {stepErrors.map((err, i) => <li key={i}>{err}</li>)}
              </ul>
            </div>
          )}

          <div className="actions-bar">
            <button className="btn btn-primary" onClick={() => navToNext(view)}>
              <i className="ti ti-arrow-right" />
              Save &amp; continue
            </button>
            <button className="btn btn-ghost" onClick={() => { setStepErrors([]); setView('overview'); }}>
              Back to overview
            </button>
            <span className={`saved-msg ${savedMsg ? 'show' : ''}`}>
              <i className="ti ti-check" />
              Saved
            </span>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="app">
      <input type="file" ref={fileInputRef} accept=".json" style={{ display: 'none' }} onChange={handleImport} />
      <Sidebar
        project={project}
        view={view}
        onNavigate={(v) => { setStepErrors([]); setView(v); }}
        doneCount={doneCount}
        completion={completion}
      />
      <main className="main">{renderMain()}</main>
    </div>
  );
}
