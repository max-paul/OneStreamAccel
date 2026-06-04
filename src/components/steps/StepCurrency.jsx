import InfoBox from '../InfoBox';
import TblInput from '../TblInput';
import ColumnGuide from '../ColumnGuide';

const CURRENCY_COLS = [
  { key: 'code',    label: 'ISO Code',          ph: 'e.g. USD' },
  { key: 'name',    label: 'Currency Name',      ph: 'e.g. US Dollar' },
  { key: 'default', label: 'Reporting Currency', type: 'select', options: ['Yes','No'] },
];

const CURRENCY_GUIDE = [
  {
    col: 'ISO Code',
    desc: 'The standard 3-letter ISO 4217 currency code. Must be exact — OneStream validates against the ISO standard. Common codes: USD (US Dollar), EUR (Euro), GBP (British Pound), JPY (Japanese Yen), AUD (Australian Dollar), CAD (Canadian Dollar), CHF (Swiss Franc), CNY (Chinese Yuan).',
  },
  {
    col: 'Currency Name',
    desc: 'The full descriptive name of the currency. Displayed to users in currency selectors and FX rate input forms.',
  },
  {
    col: 'Reporting Currency',
    desc: 'Mark exactly one currency as Yes — this is the group\'s presentation/reporting currency. All other entity currencies are translated into this currency during consolidation. Consolidated financial statements are presented in this currency. Typically matches the parent company\'s functional currency.',
  },
];

const DEFAULT_ROWS = [{ code: 'USD', name: 'US Dollar', default: 'Yes' }];

const RATE_HINTS = {
  'Closing':     'The exchange rate at the last day of the reporting period. Applied to Balance Sheet items (assets, liabilities, equity) to reflect period-end economic value. This is the most common default rate type.',
  'Average':     'The arithmetic average of daily rates throughout the period. Applied to P&L items (revenue, expenses) to smooth out intra-period volatility. Commonly calculated as (Sum of daily rates ÷ number of business days).',
  'Historical':  'The exchange rate at the original transaction date. Used for equity accounts (Share Capital, Retained Earnings history) to preserve the original investment value without FX revaluation.',
  'Budget Rate': 'A fixed rate agreed at the start of the budget year, used for translating budget and forecast scenarios. Eliminates FX variance from plan-vs-actual comparisons, isolating operational performance from currency movements.',
  'Custom':      'A user-defined rate type for special translations. Use when standard Closing/Average/Historical rates are insufficient for your specific accounting treatment.',
};

const TRANS_HINTS = {
  'CTA (Cumulative Translation Adjustment)': 'Standard method under IFRS (IAS 21) and US GAAP (ASC 830). FX translation differences arising from translating foreign subsidiaries are booked to a dedicated equity account (CTA). Does not impact net income — only equity. Requires a CTA account in your Chart of Accounts.',
  'Retained Earnings': 'FX translation differences are routed to the Retained Earnings account instead of a separate CTA account. Less common — used in specific regulatory or accounting policy contexts.',
  'None': 'No FX translation performed. All entities are treated as if they report in the group currency. Only appropriate for single-currency applications or when all entities share the same functional currency as the group.',
};

export default function StepCurrency({ data, onChange }) {
  const d = data || {};
  const f = (k, v) => onChange({ ...d, [k]: v });

  return (
    <div>
      <InfoBox type="info" title="Currency Setup — Multi-Currency Consolidation Framework">
        OneStream handles multi-currency consolidation natively and automatically. Define every currency that any entity in your hierarchy will use as its functional currency. The <strong>Reporting Currency</strong> is where all translated data converges for consolidated reporting. FX rates are loaded separately into the rate management area — this step defines the currency dimension itself and the translation policy.
      </InfoBox>

      {/* Currency Members */}
      <div className="form-card">
        <div className="form-card-title"><i className="ti ti-currency-dollar" />Currencies in Scope</div>
        <ColumnGuide columns={CURRENCY_GUIDE} />
        <TblInput
          cols={CURRENCY_COLS}
          rows={d.currencies || DEFAULT_ROWS}
          onChange={(r) => f('currencies', r)}
          addLabel="Add currency"
          csvFilename="currencies"
        />
        <div className="field-hint" style={{ marginTop: '10px' }}>
          Add every currency used by any entity. You must include the group reporting currency (mark as Yes), plus all local functional currencies of subsidiary entities. Missing currencies will cause data load failures for entities reporting in that currency.
        </div>
      </div>

      {/* Translation Settings */}
      <div className="form-card">
        <div className="form-card-title"><i className="ti ti-refresh" />FX Translation Configuration</div>
        <div className="form-grid">
          <div className="form-group">
            <label>Default rate type for Balance Sheet</label>
            <select value={d.rateType || 'Closing'} onChange={(e) => f('rateType', e.target.value)}>
              {Object.keys(RATE_HINTS).map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <div className="field-hint">{RATE_HINTS[d.rateType || 'Closing']}</div>
          </div>
          <div className="form-group">
            <label>Translation method (FX difference treatment)</label>
            <select value={d.transMethod || 'CTA (Cumulative Translation Adjustment)'} onChange={(e) => f('transMethod', e.target.value)}>
              {Object.keys(TRANS_HINTS).map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <div className="field-hint">{TRANS_HINTS[d.transMethod || 'CTA (Cumulative Translation Adjustment)']}</div>
          </div>
          <div className="form-group">
            <label>Triangulation currency</label>
            <select value={d.triangulation || 'No'} onChange={(e) => f('triangulation', e.target.value)}>
              <option value="No">No — not required</option>
              <option value="Yes - EUR">Yes — EUR as triangulation currency</option>
            </select>
            <div className="field-hint">Triangulation is required when converting legacy European currencies (e.g., DEM, FRF, ITL) that were fixed to EUR at the 1999 introduction. For any implementation beginning data in 2002 or later, triangulation is almost certainly not needed. Confirm with the client's Treasury or Group Accounting team if historical data pre-dates 2002.</div>
          </div>
        </div>
      </div>

      <InfoBox type="critical" title="CTA Account — Must Exist in Your Chart of Accounts">
        If you are using the CTA translation method (standard for IFRS and US GAAP), you <strong>must</strong> create a dedicated CTA equity account in your Chart of Accounts. Suggested member name: <code>EQ_CTA</code>. OneStream automatically books cumulative FX translation differences to this account during consolidation. Without it, the consolidation engine has nowhere to post the difference and your Balance Sheet will not balance after translation. This is the #1 forgotten account in new implementations.
      </InfoBox>

      <InfoBox type="tip" title="Rate Types Per Account — Standard Pattern">
        The standard rate type assignment is:<br />
        <strong>Balance Sheet accounts (Assets, Liabilities):</strong> Closing Rate<br />
        <strong>P&amp;L accounts (Revenue, Expenses):</strong> Average Rate<br />
        <strong>Equity accounts (Share Capital, historical contributions):</strong> Historical Rate<br />
        <strong>CTA account:</strong> Calculated automatically as the balancing difference (no explicit rate needed)<br /><br />
        This pattern is configured at the Account level in the Chart of Accounts — not here. What you're setting here is just the <em>default</em> when no account-level override exists.
      </InfoBox>
    </div>
  );
}
