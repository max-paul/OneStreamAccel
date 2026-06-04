import { useState } from 'react';

export default function SetupScreen({ onCreate }) {
  const [name, setName]     = useState('');
  const [client, setClient] = useState('');
  const [desc, setDesc]     = useState('');

  const create = () => {
    if (!name.trim()) return;
    onCreate({
      name: name.trim(),
      client: client.trim(),
      desc: desc.trim(),
      steps: {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  };

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div className="setup-wrap">
        <div className="setup-logo">
          OS<span> Accelerator</span>
        </div>
        <p className="setup-sub">
          The OneStream v9 configuration accelerator. Build a complete, exportable app blueprint — step by step.
        </p>
        <div className="setup-card">
          <div className="form-card-title" style={{ marginBottom: '1.25rem' }}>
            <i className="ti ti-plus" />
            Create a new project
          </div>
          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label>Project name</label>
            <input
              type="text"
              value={name}
              placeholder="e.g. Acme Corp FP&A Platform"
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && create()}
            />
          </div>
          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label>Client / company</label>
            <input
              type="text"
              value={client}
              placeholder="e.g. Acme Corporation"
              onChange={(e) => setClient(e.target.value)}
            />
          </div>
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label>Brief description</label>
            <textarea
              value={desc}
              placeholder="What is this application for?"
              onChange={(e) => setDesc(e.target.value)}
              style={{ minHeight: '60px' }}
            />
          </div>
          <button
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center' }}
            onClick={create}
            disabled={!name.trim()}
          >
            Start configuring
            <i className="ti ti-arrow-right" />
          </button>
        </div>
      </div>
    </div>
  );
}
