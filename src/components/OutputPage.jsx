import { useState, useMemo } from 'react';
import SummaryView from './SummaryView';
import { generateXML } from '../utils/xml';
import { downloadOSFile, downloadAllOSFiles } from '../utils/download';

// Lazy-load the heavy export machinery only when the import tab is opened
function ImportFilesTab({ project, onNavigate }) {
  const [confirmedSteps, setConfirmedSteps] = useState(new Set());
  const addConfirmed = (stepId) => setConfirmedSteps(prev => new Set([...prev, stepId]));

  // These imports are deferred — they only load when this component mounts (import tab opened)
  const [generators, setGenerators] = useState(null);
  const [readiness, setReadiness]   = useState(null);
  const [ExportReadiness, setExportReadiness] = useState(null);

  // Load on first render of this tab
  useMemo(() => {
    Promise.all([
      import('../utils/generators/index').then(m => m.GENERATORS),
      import('../utils/exportReadiness').then(m => m.getExportReadiness),
      import('./ExportReadiness').then(m => m.default),
    ]).then(([gens, getReadiness, ER]) => {
      setGenerators(gens);
      setReadiness(() => getReadiness);
      setExportReadiness(() => ER);
    }).catch(err => {
      console.error('Failed to load export modules:', err);
    });
  }, []);

  if (!generators || !readiness || !ExportReadiness) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text3)' }}>
        <i className="ti ti-loader" style={{ fontSize: '20px', display: 'block', marginBottom: '8px' }} />
        Loading export modules...
      </div>
    );
  }

  const { canExport, needsConfirmation } = readiness(project);
  const pendingConfirmations = (needsConfirmation || []).filter(id => !confirmedSteps.has(id));
  const exportAllowed = canExport && pendingConfirmations.length === 0;

  const PHASE_COLORS = {
    p1: 'var(--phase1)', p2: 'var(--phase2)', p3: 'var(--phase3)',
    p4: 'var(--phase4)', p5: 'var(--phase5)', p6: 'var(--phase6)',
  };
  const PHASE_LABELS = {
    p1: 'Foundation', p2: 'Dimensions', p3: 'Cube Design',
    p4: 'Data & Integration', p5: 'Workflow & Process', p6: 'Security',
  };

  return (
    <div>
      {/* Export readiness gate */}
      <ExportReadiness
        project={project}
        onNavigate={onNavigate}
        confirmedSteps={confirmedSteps}
        onConfirm={addConfirmed}
      />

      {!exportAllowed ? (
        <div style={{
          background: 'var(--bg2)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)', padding: '2rem',
          textAlign: 'center', color: 'var(--text3)',
        }}>
          <i className="ti ti-lock" style={{ fontSize: '28px', display: 'block', marginBottom: '10px', color: 'var(--border2)' }} />
          <div style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text2)', marginBottom: '6px' }}>Export locked</div>
          <div style={{ fontSize: '12.5px' }}>
            {!canExport
              ? 'Complete all required steps above to unlock the OneStream import files.'
              : 'Confirm the default values above to unlock the export.'
            }
          </div>
        </div>
      ) : (
        <div>
          <div style={{
            background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.2)',
            borderRadius: 'var(--radius)', padding: '0.875rem 1.25rem',
            fontSize: '12.5px', color: 'var(--text2)', marginBottom: '1.25rem', lineHeight: '1.65',
          }}>
            <i className="ti ti-circle-check" style={{ color: 'var(--success)', marginRight: '8px', fontSize: '15px' }} />
            <strong style={{ color: 'var(--success)' }}>Ready to export.</strong>{' '}
            Files match the exact <code style={{ fontSize: '11px' }}>OneStreamXF v9.3</code> format.
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div style={{ fontSize: '12px', color: 'var(--text3)' }}>{generators.length} importable files</div>
            <button className="btn btn-primary" onClick={() => downloadAllOSFiles(project)}>
              <i className="ti ti-download" />
              Download all {generators.length} files
            </button>
          </div>

          {Object.entries(PHASE_LABELS).map(([phase, label]) => {
            const gens = generators.filter(g => g.phase === phase);
            if (!gens.length) return null;
            return (
              <div key={phase} style={{ marginBottom: '1.5rem' }}>
                <div style={{
                  fontSize: '11px', fontWeight: '600', textTransform: 'uppercase',
                  letterSpacing: '0.8px', color: PHASE_COLORS[phase], marginBottom: '8px',
                  display: 'flex', alignItems: 'center', gap: '8px',
                }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: PHASE_COLORS[phase], display: 'inline-block' }} />
                  {label}
                </div>
                {gens.map(gen => (
                  <div key={gen.filename} style={{
                    display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center',
                    gap: '1rem', padding: '0.875rem 1.25rem', background: 'var(--bg3)',
                    borderRadius: 'var(--radius)', marginBottom: '8px',
                  }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                        <span style={{ fontSize: '11px', fontFamily: "'DM Mono',monospace", color: 'var(--text)', fontWeight: '500' }}>
                          {gen.filename}
                        </span>
                        <span style={{
                          fontSize: '10px', fontWeight: '600', textTransform: 'uppercase',
                          padding: '1px 7px', borderRadius: '99px',
                          background: `color-mix(in srgb, ${PHASE_COLORS[gen.phase]} 15%, transparent)`,
                          color: PHASE_COLORS[gen.phase],
                        }}>{PHASE_LABELS[gen.phase]}</span>
                      </div>
                      <div style={{ fontSize: '11.5px', color: 'var(--text3)' }}>
                        <i className="ti ti-arrow-right" style={{ fontSize: '10px', marginRight: '4px' }} />
                        {gen.description}
                      </div>
                    </div>
                    <button className="btn btn-ghost" style={{ fontSize: '12px', padding: '0.35rem 0.85rem' }}
                      onClick={() => downloadOSFile(project, gen.filename)}>
                      <i className="ti ti-download" style={{ fontSize: '13px' }} />
                      Download
                    </button>
                  </div>
                ))}
              </div>
            );
          })}

          <div style={{
            marginTop: '1.5rem', background: 'var(--bg2)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius)', padding: '1rem 1.25rem',
          }}>
            <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text2)', marginBottom: '8px' }}>
              <i className="ti ti-list-numbers" style={{ marginRight: '6px', color: 'var(--accent)' }} />
              Recommended Import Sequence
            </div>
            <ol style={{ fontSize: '12px', color: 'var(--text3)', lineHeight: '2.1', paddingLeft: '1.25rem' }}>
              <li>Create the application in OneStream (<em>Administration → Applications → New</em>)</li>
              <li>Import <code>ApplicationProperties.xml</code></li>
              <li>Load dimension members via <em>Dimension Management → Load Members</em></li>
              <li>Import <code>DataSources.xml</code> — update connection strings after import</li>
              <li>Import <code>TransformationRules.xml</code> — expand with full mapping tables</li>
              <li>Import <code>DataManagement.xml</code></li>
              <li>Import <code>WorkflowProfiles.xml</code></li>
              <li>Import <code>CertificationQuestions.xml</code></li>
              <li>Import <code>ApplicationSecurityRoles.xml</code> — assign users to groups</li>
            </ol>
          </div>
        </div>
      )}
    </div>
  );
}

export default function OutputPage({ project, outputTab, setOutputTab, onDownloadXML, onDownloadJSON, onNavigate }) {
  const xml = useMemo(() => generateXML(project), [project]);

  return (
    <div>
      <div className="page-header">
        <div className="breadcrumb">Export</div>
        <div className="page-title">Configuration Output</div>
        <div className="page-subtitle">
          Human-readable summary, design-spec XML, and production-ready OneStream import files.
        </div>
      </div>

      <div className="tab-row">
        <button className={`tab-btn ${outputTab === 'human' ? 'active' : ''}`} onClick={() => setOutputTab('human')}>
          <i className="ti ti-file-text" style={{ marginRight: '5px' }} />Summary
        </button>
        <button className={`tab-btn ${outputTab === 'xml' ? 'active' : ''}`} onClick={() => setOutputTab('xml')}>
          <i className="ti ti-code" style={{ marginRight: '5px' }} />Design XML
        </button>
        <button className={`tab-btn ${outputTab === 'import' ? 'active' : ''}`} onClick={() => setOutputTab('import')}>
          <i className="ti ti-package-import" style={{ marginRight: '5px' }} />OneStream Import Files
        </button>
      </div>

      {outputTab === 'human' && <SummaryView project={project} />}

      {outputTab === 'xml' && (
        <div>
          <div style={{
            background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.2)',
            borderRadius: 'var(--radius)', padding: '0.75rem 1rem', marginBottom: '1rem',
            fontSize: '12.5px', color: 'var(--text2)',
          }}>
            <i className="ti ti-info-circle" style={{ color: 'var(--warning)', marginRight: '8px' }} />
            This is a <strong>design specification document</strong>. Use the <strong>OneStream Import Files</strong> tab for directly importable XML.
          </div>
          <div className="xml-wrap">
            <div className="xml-box">{xml}</div>
            <button className="copy-btn" onClick={() => navigator.clipboard?.writeText(xml).catch(() => {})}>
              <i className="ti ti-copy" />Copy
            </button>
          </div>
        </div>
      )}

      {outputTab === 'import' && (
        <ImportFilesTab project={project} onNavigate={onNavigate} />
      )}

      <div style={{ display: 'flex', gap: '10px', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)' }}>
        <button className="btn btn-primary" onClick={onDownloadXML}>
          <i className="ti ti-download" />Design spec XML
        </button>
        <button className="btn btn-ghost" onClick={onDownloadJSON}>
          <i className="ti ti-download" />Project JSON
        </button>
      </div>
    </div>
  );
}
