import InfoBox from '../InfoBox';
import TblInput from '../TblInput';
import ColumnGuide from '../ColumnGuide';

const COLS = [
  { key: 'name',   label: 'Certification Name',       ph: 'e.g. Balance Sheet Reconciliation — Trade AR' },
  { key: 'type',   label: 'Certification Type',        type: 'select', options: ['Account Reconciliation','Workflow Sign-off','Data Quality Check','Intercompany Agreement','Variance Explanation','Custom'] },
  { key: 'owner',  label: 'Owner Group',               ph: 'e.g. GRP_ENTITY_FINANCE' },
  { key: 'freq',   label: 'Frequency',                 type: 'select', options: ['Monthly','Quarterly','Semi-Annual','Annual'] },
  { key: 'dueDay', label: 'Due Day (of month)',        ph: 'e.g. 5 (working day 5)' },
];

const CERT_GUIDE = [
  {
    col: 'Certification Name',
    desc: 'A specific, descriptive name that identifies the exact account or process being certified. Good: "Balance Sheet Reconciliation — Trade Accounts Receivable". Bad: "AR Cert". The name should be precise enough that the certifier knows exactly what they are signing off on without additional documentation.',
  },
  {
    col: 'Certification Type',
    desc: 'The category of certification, which determines the workflow and sign-off structure.',
    options: [
      { val: 'Account Reconciliation',  meaning: 'The certifier confirms that the OneStream balance for a specific account agrees to a supporting schedule (bank statement, AR subledger, AP subledger, etc.). The most common certification type — drives financial accuracy and audit readiness.' },
      { val: 'Workflow Sign-off',        meaning: 'A declaration that a specific close process or workflow step has been completed correctly. Used for process control points like "all entities submitted" or "consolidation adjustments reviewed".' },
      { val: 'Data Quality Check',       meaning: 'Verification that data loaded into OneStream is complete, accurate, and free of anomalies. Includes checks like: "total loaded amount agrees to GL extract", "no UNMAPPED_ACCOUNT balance", "no entities with zero balance".' },
      { val: 'Intercompany Agreement',   meaning: 'Confirmation that intercompany balances between two specific entities have been agreed and reconciled between the transacting parties before elimination. Critical for IC reconciliation programs.' },
      { val: 'Variance Explanation',     meaning: 'Requires the certifier to document the reason for material variances vs. budget, prior year, or prior period. Provides narrative context for the numbers that auditors and management require.' },
      { val: 'Custom',                   meaning: 'A custom certification type defined by a business rule. Used for highly specific compliance requirements or attestations unique to your organization or industry.' },
    ],
  },
  {
    col: 'Owner Group',
    desc: 'The user group responsible for completing and submitting this certification. Must match a user group defined in User Groups (Phase 6). The owner group receives notifications when the certification period opens and reminder alerts as the due date approaches.',
  },
  {
    col: 'Frequency',
    desc: 'How often a new certification instance is created. Monthly certifications are most common for high-risk balance sheet accounts. Quarterly for lower-risk items. Annual for equity accounts and long-term provisions that don\'t change frequently.',
  },
  {
    col: 'Due Day (of month)',
    desc: 'The calendar day by which this certification must be completed and approved. Expressed as a working day (e.g., "5" = 5th working day of the following month) or calendar day. Must be defined in the context of your overall close calendar. Ensure this date is BEFORE the group sign-off date, not after.',
  },
];

export default function StepCertification({ data, onChange }) {
  const d = data || {};
  const f = (k, v) => onChange({ ...d, [k]: v });

  return (
    <div>
      <InfoBox type="info" title="Certification Setup — Audit-Grade Control Evidence">
        OneStream Certifications create a permanent, time-stamped record of who reviewed what, when, and what conclusion they reached. Unlike informal email sign-offs, certifications in OneStream are searchable, reportable, and directly linked to the specific account balances being certified. External auditors can access certification history directly from OneStream, dramatically reducing the time spent gathering close process evidence during the annual audit.
      </InfoBox>

      <div className="form-card">
        <div className="form-card-title"><i className="ti ti-certificate" />Certification Profiles</div>
        <ColumnGuide columns={CERT_GUIDE} />
        <TblInput cols={COLS} rows={d.certifications || []} onChange={(r) => f('certifications', r)} addLabel="Add certification" />
      </div>

      <InfoBox type="tip" title="Risk-Based Prioritization — Start With High-Risk Accounts">
        Don't try to certify every account in Phase 1. Focus certification on accounts with the highest audit risk, the largest balances, or the most subjective estimates:<br /><br />
        <strong>Tier 1 — Certify Monthly (highest risk):</strong><br />
        Cash &amp; Bank Accounts, Trade Receivables (AR), Trade Payables (AP), Intercompany Balances (before elimination), Short-term Borrowings, Accrued Liabilities<br /><br />
        <strong>Tier 2 — Certify Quarterly:</strong><br />
        Fixed Assets (net), Inventory, Prepayments, Long-term Debt, Deferred Revenue, Employee Benefits Provisions<br /><br />
        <strong>Tier 3 — Certify Annually:</strong><br />
        Intangible Assets, Goodwill (impairment review), Equity Investments, Pension Obligations<br /><br />
        Expand to lower-risk accounts once the Tier 1 process is mature and the team is comfortable with the system.
      </InfoBox>

      <InfoBox type="warning" title="Certification Timeline Must Be Built Into the Close Calendar">
        A common design error: certifications are due on day 5, but the workflow approval (which certifications are often a prerequisite for) is also due on day 5. This makes it mathematically impossible to complete both.<br /><br />
        Build a close calendar BEFORE finalizing certification due dates. The typical flow is:<br />
        <strong>Day 1–3:</strong> Entity finance submits workflow + completes Tier 1 certifications<br />
        <strong>Day 3–5:</strong> Regional controller reviews workflow + approves certifications<br />
        <strong>Day 5–7:</strong> Group controller final approval + runs group consolidation<br />
        <strong>Day 7–10:</strong> Group reporting pack preparation and sign-off
      </InfoBox>
    </div>
  );
}
