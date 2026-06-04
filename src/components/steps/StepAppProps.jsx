import InfoBox from '../InfoBox';

const CURRENCIES    = ['USD','EUR','GBP','JPY','AUD','CAD','CHF','CNY','HKD','SGD','BRL','INR','MXN','KRW','SEK','NOK','DKK','ZAR'];
const VERSIONS      = ['9.x','8.4','8.3','8.2','8.1','8.0'];
const IMPL_TYPES    = ['New Implementation','Migration from Legacy CPM','Phase 2 / Extension','Version Upgrade','Proof of Concept'];
const CONSOL_SCOPES = ['Statutory & Management Reporting','Statutory Consolidation Only','Management Reporting Only','Planning & Budgeting Only'];
const INDUSTRIES    = ['Financial Services & Banking','Insurance','Manufacturing & Industrial','Retail & Consumer Goods','Healthcare & Life Sciences','Energy & Utilities','Technology & Software','Real Estate & Construction','Government & Public Sector','Professional Services','Other'];
const INSTANCE_TYPES= ['OneStream Cloud (SaaS)','On-Premise','Private Cloud / Hosted'];
const ENVIRONMENTS  = ['Production','Development / Sandbox','QA / User Acceptance Testing','Training'];

const CONSOL_HINTS = {
  'Ownership':     'Full consolidation. 100% of the subsidiary\'s revenues, expenses, assets, and liabilities are consolidated into the group. Minority interest is calculated automatically for entities owned less than 100%. This is the correct method for the vast majority of legal consolidations.',
  'Equity':        'Net equity share only. The group\'s proportionate share of the entity\'s net assets appears as a single investment line on the Balance Sheet. No revenue or expense consolidation occurs. Used for entities where ownership is 20–50% (significant influence but not control).',
  'Proportional':  'Pro-rata consolidation. Each P&L and Balance Sheet line item is included at the ownership percentage. Commonly used for joint ventures where both partners share control. Being phased out under IFRS 11 in favor of Equity method, but still required under US GAAP in some cases.',
  'None':          'No consolidation. The entity exists in the hierarchy for organizational or reporting display purposes only. Its data does not roll up to parent entities. Use for informational entities, dormant companies, or entities outside the consolidation scope.',
};

const Req = () => <span className="req">*</span>;

export default function StepAppProps({ data, onChange }) {
  const d = data || {};
  const f = (k, v) => onChange({ ...d, [k]: v });

  return (
    <div>
      <InfoBox type="info" title="Application Properties — The Foundation of Everything">
        These settings define the core identity of your OneStream application. The <strong>Application ID</strong> is the permanent technical identifier used throughout the platform — in business rules, APIs, integrations, and all system logs. Choose it carefully: <strong>it cannot be changed after deployment</strong> without a full rebuild. Use uppercase letters, numbers, and underscores only (e.g., <code>FPA_PROD</code>, <code>ACME_CONSOL</code>).
      </InfoBox>

      {/* ── Application Identity ─────────────────────────────────── */}
      <div className="form-card">
        <div className="form-card-title"><i className="ti ti-building" />Application Identity</div>
        <div className="form-grid">
          <div className="form-group">
            <label>Application name <Req /></label>
            <input
              type="text"
              value={d.name || ''}
              placeholder="e.g. Acme Corp Financial Close"
              onChange={(e) => f('name', e.target.value)}
            />
            <div className="field-hint">The display name shown to all users across dashboards, reports, and the platform header. Can be changed at any time without impact.</div>
          </div>
          <div className="form-group">
            <label>Application ID <Req /></label>
            <input
              type="text"
              value={d.appId || ''}
              placeholder="e.g. ACME_CONSOL_PROD"
              onChange={(e) => f('appId', e.target.value.toUpperCase().replace(/[^A-Z0-9_]/g, ''))}
            />
            <div className="field-hint"><strong>Permanent after deployment.</strong> Uppercase letters, numbers, and underscores only. Used in all business rules and integrations. Convention: [CLIENT]_[PURPOSE]_[ENV]</div>
          </div>
          <div className="form-group full">
            <label>Description</label>
            <textarea
              value={d.description || ''}
              placeholder="Describe the application's purpose, scope, key modules, and primary stakeholders. This serves as documentation for future configuration teams."
              onChange={(e) => f('description', e.target.value)}
            />
            <div className="field-hint">Treated as documentation — include implementation scope, go-live date, primary stakeholders, and key design decisions. Future consultants will thank you.</div>
          </div>
        </div>
      </div>

      {/* ── Consolidation & Platform ──────────────────────────────── */}
      <div className="form-card">
        <div className="form-card-title"><i className="ti ti-settings" />Consolidation &amp; Platform Settings</div>
        <div className="form-grid">
          <div className="form-group">
            <label>Group / reporting currency <Req /></label>
            <select value={d.currency || 'USD'} onChange={(e) => f('currency', e.target.value)}>
              {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <div className="field-hint">The currency in which consolidated financial statements are presented to shareholders and management. All entity data is translated into this currency during consolidation. Confirm with the Group CFO before selecting — this drives all FX translation.</div>
          </div>
          <div className="form-group">
            <label>Consolidation method <Req /></label>
            <select value={d.consol || 'Ownership'} onChange={(e) => f('consol', e.target.value)}>
              {Object.keys(CONSOL_HINTS).map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            {CONSOL_HINTS[d.consol || 'Ownership'] && (
              <div className="field-hint">{CONSOL_HINTS[d.consol || 'Ownership']}</div>
            )}
          </div>
          <div className="form-group">
            <label>Consolidation scope</label>
            <select value={d.consolScope || ''} onChange={(e) => f('consolScope', e.target.value)}>
              <option value="">— Select scope —</option>
              {CONSOL_SCOPES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <div className="field-hint">
              {d.consolScope === 'Statutory & Management Reporting' && 'Most comprehensive scope — requires both legal entity consolidation AND management segment reporting. Typically needs alternate entity rollups and possibly multiple cubes.'}
              {d.consolScope === 'Statutory Consolidation Only' && 'Legal entity consolidation only. No management/segment reporting layer. Simpler entity hierarchy and fewer cubes needed.'}
              {d.consolScope === 'Management Reporting Only' && 'Management structure reporting without statutory legal consolidation. Common for internal FP&A applications alongside a separate statutory close platform.'}
              {d.consolScope === 'Planning & Budgeting Only' && 'No consolidation — purely a planning and forecasting application. Typically uses simpler entity structures and Planning-type cubes only.'}
              {!d.consolScope && 'Defines the breadth of what this OneStream application will deliver. Impacts entity hierarchy design, number of cubes, and module complexity.'}
            </div>
          </div>
          <div className="form-group">
            <label>Platform version</label>
            <select value={d.version || '9.x'} onChange={(e) => f('version', e.target.value)}>
              {VERSIONS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <div className="field-hint">Determines available features and syntax for business rules. Confirm the exact version with your OneStream Cloud or IT team. v9.x introduced major enhancements to workflow, reporting, and the MarketPlace solution framework.</div>
          </div>
        </div>
      </div>

      {/* ── Implementation Context ────────────────────────────────── */}
      <div className="form-card">
        <div className="form-card-title"><i className="ti ti-clipboard-list" />Implementation Context</div>
        <div className="form-grid">
          <div className="form-group">
            <label>Implementation type</label>
            <select value={d.implType || ''} onChange={(e) => f('implType', e.target.value)}>
              <option value="">— Select type —</option>
              {IMPL_TYPES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <div className="field-hint">
              {d.implType === 'New Implementation' && 'Greenfield — no existing OneStream environment. Full configuration from scratch.'}
              {d.implType === 'Migration from Legacy CPM' && 'Replacing HFM, BPC, Cognos, Tagetik, or similar. Account/entity mapping from legacy system is a critical workstream.'}
              {d.implType === 'Phase 2 / Extension' && 'Expanding an existing OneStream application with new modules, cubes, or geographies. Be cautious not to disrupt live users.'}
              {d.implType === 'Version Upgrade' && 'Upgrading OneStream platform version. Review release notes for deprecated features and API changes in business rules.'}
              {d.implType === 'Proof of Concept' && 'Exploratory build — use Development environment only. Confirm scope and limitations with stakeholders upfront.'}
              {!d.implType && 'Understanding implementation type helps scope the configuration effort and identify key risks early.'}
            </div>
          </div>
          <div className="form-group">
            <label>Industry vertical</label>
            <select value={d.industry || ''} onChange={(e) => f('industry', e.target.value)}>
              <option value="">— Select industry —</option>
              {INDUSTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <div className="field-hint">Industry drives account structure conventions, common KPIs, regulatory reporting requirements, and which OneStream MarketPlace solutions are relevant to this engagement.</div>
          </div>
          <div className="form-group">
            <label>Instance type</label>
            <select value={d.instanceType || ''} onChange={(e) => f('instanceType', e.target.value)}>
              <option value="">— Select instance —</option>
              {INSTANCE_TYPES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <div className="field-hint">
              {d.instanceType === 'OneStream Cloud (SaaS)' && 'Hosted and managed by OneStream Software. Automatic upgrades, built-in disaster recovery. Most common for new implementations since 2020.'}
              {d.instanceType === 'On-Premise' && 'Client-managed infrastructure. Client IT team is responsible for upgrades, patching, backups, and availability. Requires formal upgrade projects.'}
              {d.instanceType === 'Private Cloud / Hosted' && 'Dedicated cloud infrastructure managed by a third-party hosting partner. Hybrid of SaaS convenience and dedicated isolation.'}
              {!d.instanceType && 'Impacts deployment approach, upgrade cadence, DR/backup responsibilities, and integration architecture.'}
            </div>
          </div>
          <div className="form-group">
            <label>Environment</label>
            <select value={d.environment || ''} onChange={(e) => f('environment', e.target.value)}>
              <option value="">— Select environment —</option>
              {ENVIRONMENTS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <div className="field-hint">
              {d.environment === 'Production' && 'Live environment — all changes require formal change management. Never configure directly in Production without UAT sign-off.'}
              {d.environment === 'Development / Sandbox' && 'Free to experiment. Changes do not affect live users. Should mirror Production configuration to avoid promotion surprises.'}
              {d.environment === 'QA / User Acceptance Testing' && 'Staging environment for formal testing before Production promotion. Configuration should match Production as closely as possible.'}
              {d.environment === 'Training' && 'Separate environment with anonymized or synthetic data for user training. Typically refreshed from Production periodically.'}
              {!d.environment && 'Document which environment this configuration blueprint applies to — prevents accidental deployment to the wrong instance.'}
            </div>
          </div>
          <div className="form-group">
            <label>Target go-live date</label>
            <input
              type="text"
              value={d.goLiveTarget || ''}
              placeholder="e.g. Q2 2025 / March 31, 2025"
              onChange={(e) => f('goLiveTarget', e.target.value)}
            />
            <div className="field-hint">Document the agreed go-live date here. This is visible in the export XML and summary, serving as a reference point for timeline management throughout the engagement.</div>
          </div>
        </div>
      </div>

      <InfoBox type="tip" title="Application ID Convention — Critical for Multi-Environment Management">
        Use the pattern <strong>[CLIENT]_[PURPOSE]_[ENV]</strong> consistently across all environments:<br />
        <code>ACME_CONSOL_DEV</code> → <code>ACME_CONSOL_QA</code> → <code>ACME_CONSOL_PROD</code><br /><br />
        When business rules reference the Application ID (e.g., for environment-aware logic), having this pattern means you can use a simple string replace to promote rules between environments rather than manually hunting through code. One of the most overlooked but highest-value naming decisions in any engagement.
      </InfoBox>
    </div>
  );
}
