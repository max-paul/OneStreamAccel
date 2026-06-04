import InfoBox from '../InfoBox';

const FREQUENCIES    = ['Monthly', 'Quarterly', 'Weekly', 'Daily'];
const MONTHS         = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const CALENDAR_TYPES = ['Standard 12-Month (Gregorian)', '4-4-5 Week Pattern', '4-5-4 Week Pattern', '5-4-4 Week Pattern', '13-Period (4-Week)', 'Custom'];
const INCLUDE_P0     = ['Yes — Include Period 0 (Recommended)', 'No'];
const YTD_METHODS    = ['Periodic Storage (Recommended)', 'Year-to-Date Storage'];

const Req = () => <span className="req">*</span>;

export default function StepTimeProfile({ data, onChange }) {
  const d = data || {};
  const f = (k, v) => onChange({ ...d, [k]: v });

  return (
    <div>
      <InfoBox type="critical" title="Critical — Time Profile is Permanent">
        The Time Profile is the single most important structural decision in your OneStream implementation. <strong>It cannot be changed after data has been loaded without a full application rebuild.</strong> Take extra care to confirm your fiscal year end, period count, and year range with your client's finance team and IT before proceeding.
      </InfoBox>

      <div className="form-card">
        <div className="form-card-title"><i className="ti ti-calendar" />Fiscal Calendar Configuration</div>
        <div className="form-grid">
          <div className="form-group">
            <label>Start year <Req /></label>
            <input type="number" value={d.startYear || ''} placeholder="e.g. 2018" onChange={(e) => f('startYear', e.target.value)} />
            <div className="field-hint">Go at least 3–5 years back from go-live to support historical reporting and comparatives.</div>
          </div>
          <div className="form-group">
            <label>End year <Req /></label>
            <input type="number" value={d.endYear || ''} placeholder="e.g. 2035" onChange={(e) => f('endYear', e.target.value)} />
            <div className="field-hint">Extend 5–10 years beyond go-live year to accommodate long-range planning scenarios.</div>
          </div>
          <div className="form-group">
            <label>Period frequency <Req /></label>
            <select value={d.frequency || 'Monthly'} onChange={(e) => f('frequency', e.target.value)}>
              {FREQUENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <div className="field-hint">Monthly is standard for most consolidation and planning implementations.</div>
          </div>
          <div className="form-group">
            <label>Fiscal year end <Req /></label>
            <select value={d.fyEnd || 'December'} onChange={(e) => f('fyEnd', e.target.value)}>
              {MONTHS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <div className="field-hint">Last month of the fiscal year. December = calendar year. March = UK/Japan fiscal year.</div>
          </div>
          <div className="form-group">
            <label>Number of periods <Req /></label>
            <input type="number" value={d.periods || ''} placeholder="12 or 13" onChange={(e) => f('periods', e.target.value)} />
            <div className="field-hint">Use 13 to include Period 0 (opening balance period) — strongly recommended for consolidation.</div>
          </div>
          <div className="form-group">
            <label>Prior-year periods to carry back</label>
            <input type="number" value={d.priorPeriods || ''} placeholder="3" onChange={(e) => f('priorPeriods', e.target.value)} />
            <div className="field-hint">How many prior periods to allow data entry for in reporting views.</div>
          </div>
        </div>
      </div>

      <div className="form-card">
        <div className="form-card-title"><i className="ti ti-adjustments" />Advanced Calendar Settings</div>
        <div className="form-grid">
          <div className="form-group">
            <label>Calendar type</label>
            <select value={d.calendarType || ''} onChange={(e) => f('calendarType', e.target.value)}>
              <option value="">— Select calendar type —</option>
              {CALENDAR_TYPES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <div className="field-hint">Most clients use Standard 12-Month. Retail often uses 4-4-5 or 4-5-4 for equal week distribution.</div>
          </div>
          <div className="form-group">
            <label>Include Period 0 (opening balances)</label>
            <select value={d.includeP0 || ''} onChange={(e) => f('includeP0', e.target.value)}>
              <option value="">— Select —</option>
              {INCLUDE_P0.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <div className="field-hint">Period 0 stores opening balance sheet values and is essential for correct roll-forward calculations.</div>
          </div>
          <div className="form-group">
            <label>Data storage method</label>
            <select value={d.ytdMethod || ''} onChange={(e) => f('ytdMethod', e.target.value)}>
              <option value="">— Select method —</option>
              {YTD_METHODS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <div className="field-hint">Periodic storage (stores each period independently) is recommended for most implementations.</div>
          </div>
        </div>
      </div>

      <InfoBox type="tip" title="Best Practice — Year Range">
        <strong>Start year:</strong> Go back to the earliest year for which historical data will be loaded — typically 3–5 years before go-live. <strong>End year:</strong> Extend at least 10 years forward to accommodate long-range planning (LRP) models and future budget cycles. Running out of years requires a platform rebuild.
      </InfoBox>
    </div>
  );
}
