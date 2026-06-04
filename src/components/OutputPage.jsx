import SummaryView from './SummaryView';
import { generateXML } from '../utils/xml';

export default function OutputPage({ project, outputTab, setOutputTab, onDownloadXML, onDownloadJSON }) {
  const xml = generateXML(project);

  return (
    <div>
      <div className="page-header">
        <div className="breadcrumb">Export</div>
        <div className="page-title">Configuration output</div>
        <div className="page-subtitle">Human-readable summary and v9-compatible XML.</div>
      </div>

      <div className="tab-row">
        <button className={`tab-btn ${outputTab === 'human' ? 'active' : ''}`} onClick={() => setOutputTab('human')}>
          <i className="ti ti-file-text" style={{ marginRight: '5px' }} />
          Summary
        </button>
        <button className={`tab-btn ${outputTab === 'xml' ? 'active' : ''}`} onClick={() => setOutputTab('xml')}>
          <i className="ti ti-code" style={{ marginRight: '5px' }} />
          XML
        </button>
      </div>

      {outputTab === 'human' && <SummaryView project={project} />}

      {outputTab === 'xml' && (
        <div className="xml-wrap">
          <div className="xml-box">{xml}</div>
          <button className="copy-btn" onClick={() => navigator.clipboard?.writeText(xml).catch(() => {})}>
            <i className="ti ti-copy" />
            Copy
          </button>
        </div>
      )}

      <div style={{ display: 'flex', gap: '10px', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)' }}>
        <button className="btn btn-primary" onClick={onDownloadXML}>
          <i className="ti ti-download" />
          Download XML
        </button>
        <button className="btn btn-ghost" onClick={onDownloadJSON}>
          <i className="ti ti-download" />
          Download project JSON
        </button>
      </div>
    </div>
  );
}
