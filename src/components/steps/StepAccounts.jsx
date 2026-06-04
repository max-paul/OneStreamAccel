import InfoBox from '../InfoBox';
import TblInput from '../TblInput';
import ColumnGuide from '../ColumnGuide';

const ACCOUNT_COLS = [
  { key: 'code',         label: 'Member Name',   ph: 'e.g. REV_PRODUCT' },
  { key: 'name',         label: 'Description',   ph: 'e.g. Product Revenue' },
  { key: 'type',         label: 'Account Type',  type: 'select', options: ['Revenue','Expense','Asset','Liability','Equity','Statistical','Flow','Heading'] },
  { key: 'flow',         label: 'Flow Type',     type: 'select', options: ['Flow (P&L)','Balance','AverageBalance','EndBalance'] },
  { key: 'sign',         label: 'Sign',          type: 'select', options: ['Normal','Reverse'] },
  { key: 'inputAllowed', label: 'Allow Input',   type: 'select', options: ['Yes','No'] },
  { key: 'icp',          label: 'ICP',           type: 'select', options: ['No','Yes'] },
  { key: 'parent',       label: 'Parent Member', ph: 'e.g. TOTAL_REVENUE' },
];

const ACCT_GUIDE = [
  {
    col: 'Member Name',
    desc: 'The technical identifier used in business rules, reports, templates, and APIs. No spaces — use underscores. This is permanent once data is loaded. Follow a consistent prefix system: REV_ for Revenue, EXP_ for Expense, AST_ for Asset, LIA_ for Liability, EQ_ for Equity, STAT_ for Statistical, TOTAL_ or HDR_ for parent/heading accounts.',
  },
  {
    col: 'Description',
    desc: 'The human-readable account name shown in reports, dashboards, and data entry templates. Can include spaces and abbreviations familiar to your finance team.',
  },
  {
    col: 'Account Type',
    desc: 'Defines the financial statement category and drives how OneStream handles sign convention, flow type defaults, and consolidation behavior.',
    options: [
      { val: 'Revenue',     meaning: 'Income from operations. Periodic P&L account — each period is independent. Credit balance convention. Typical accounts: product sales, service revenue, interest income.' },
      { val: 'Expense',     meaning: 'Costs incurred in generating revenue. Periodic P&L account. Debit balance convention. Sub-types: COGS, operating expenses, D&A, interest expense, tax expense.' },
      { val: 'Asset',       meaning: 'Resources owned or controlled. Balance Sheet account — closing balance carries to next period opening. Debit balance convention. Current vs. non-current distinction important for sub-hierarchy.' },
      { val: 'Liability',   meaning: 'Obligations owed to third parties. Balance Sheet account — carries forward each period. Credit balance convention. Current vs. long-term: trade payables, accruals, debt, deferred revenue.' },
      { val: 'Equity',      meaning: 'Owners\' residual interest. Balance Sheet account. Credit balance convention. Must include: Share Capital, Retained Earnings, CTA (for multi-currency), and any other reserve accounts.' },
      { val: 'Statistical', meaning: 'Non-financial KPIs and operational metrics. No standard sign convention. Not included in financial statement calculations. Examples: FTE headcount, units sold, square footage, CO₂ emissions.' },
      { val: 'Flow',        meaning: 'Sub-category accounts used within a balance roll-forward analysis (additions, disposals, etc.). These are always children of Balance-type parent accounts, not standalone P&L accounts.' },
      { val: 'Heading',     meaning: 'Parent/subtotal account that holds no data itself — purely structural. Used to organize the COA hierarchy (e.g., TOTAL_ASSETS, HDR_CURR_ASSETS). No data is ever stored at Heading members.' },
    ],
  },
  {
    col: 'Flow Type',
    desc: 'Controls how OneStream stores and carries data for this account between periods. This is one of the most critical settings — getting it wrong causes incorrect period-end balances.',
    options: [
      { val: 'Flow (P&L)',      meaning: 'Periodic account — each period\'s value is independent. Data does NOT carry forward. Correct for all Revenue and Expense accounts. Think of it as: "this period\'s P&L activity."' },
      { val: 'Balance',         meaning: 'Balance sheet account — the closing balance of period N becomes the opening balance of period N+1 automatically. Correct for Assets, Liabilities, and Equity. Think of it as: "what we own/owe at period end."' },
      { val: 'AverageBalance',  meaning: 'Calculates an average of opening and closing balance for the period. Used for asset accounts that attract interest (e.g., average loan balance for interest expense calculation). Less common.' },
      { val: 'EndBalance',      meaning: 'Period-end snapshot — similar to Balance but for point-in-time measurements. Used when you need a closing balance that does not automatically carry forward (e.g., headcount at period end as a statistical balance).' },
    ],
  },
  {
    col: 'Sign',
    desc: 'Controls how OneStream interprets the sign of stored values for this account. Affects how values display in reports and how calculations work.',
    options: [
      { val: 'Normal',   meaning: 'Standard sign behavior. Assets and Expenses: positive stored values = positive display. Liabilities, Equity, Revenue: negative stored values = positive display (credit convention). OneStream handles the display sign automatically based on Account Type.' },
      { val: 'Reverse',  meaning: 'Flips the sign convention from Normal. Use this when you want to override the standard behavior — for example, if a specific account needs to display as positive even though its Account Type would normally show it as negative. Use sparingly to avoid confusion.' },
    ],
  },
  {
    col: 'Allow Input',
    desc: 'Whether end users and data loads can write values to this specific account. Set to Yes for leaf/detail accounts. Set to No for all parent (Heading) accounts and calculated accounts — data rolls up to parents automatically and should never be directly input.',
  },
  {
    col: 'ICP',
    desc: 'Enable Intercompany Partner tracking for this account. Set to Yes for any account that records intercompany transactions: intercompany revenue, intercompany payables/receivables, intercompany loans, dividends paid to/from group entities. ICP-enabled accounts require an ICP dimension value on every data entry — this is how elimination works.',
  },
  {
    col: 'Parent Member',
    desc: 'The parent account in the COA hierarchy. Must exactly match the Member Name of another account (typically a Heading type). This defines the roll-up structure — e.g., REV_PRODUCT_SALES rolls into TOTAL_PRODUCT_REVENUE, which rolls into TOTAL_REVENUE, which rolls into NET_INCOME.',
  },
];

export default function StepAccounts({ data, onChange }) {
  const d = data || {};
  const f = (k, v) => onChange({ ...d, [k]: v });

  return (
    <div>
      <InfoBox type="info" title="Chart of Accounts — The Backbone of Your Financial Intelligence Cube">
        The Account dimension is the most important dimension in OneStream. It contains your entire Chart of Accounts — from individual transaction-level accounts up through every subtotal to the top-level financial statement totals. Unlike a traditional flat COA, OneStream accounts form a <strong>multi-level hierarchy</strong> with parent/child relationships that drive both reporting rollups and consolidation calculations. Design this with your Controller and external auditors in mind.
      </InfoBox>

      <InfoBox type="critical" title="Mandatory System Accounts — Your Application Won't Balance Without These">
        Every OneStream consolidation application requires these accounts. Add them <strong>before</strong> any other accounts and make them the parents of all other accounts in their category:
        <ul style={{ margin: '8px 0 0', paddingLeft: '1.25rem', lineHeight: '2' }}>
          <li><code>TOTAL_ASSETS</code> — top parent of ALL asset accounts (Heading type, Balance flow)</li>
          <li><code>TOTAL_LIABILITIES</code> — top parent of ALL liability accounts (Heading type, Balance flow)</li>
          <li><code>TOTAL_EQUITY</code> — top parent of ALL equity accounts including Retained Earnings and CTA</li>
          <li><code>NET_INCOME</code> — <em>calculated</em>: Total Revenue minus Total Expenses; must link P&amp;L to Balance Sheet</li>
          <li><code>RETAINED_EARNINGS</code> — equity account that accumulates prior-year net income each year</li>
          <li><code>EQ_CTA</code> — Cumulative Translation Adjustment equity account (multi-currency applications only)</li>
        </ul>
        <strong>The Balance Sheet equation (Total Assets = Total Liabilities + Total Equity) must hold or consolidation will fail.</strong>
      </InfoBox>

      <div className="form-card">
        <div className="form-card-title"><i className="ti ti-list-details" />Account Members</div>
        <ColumnGuide columns={ACCT_GUIDE} />
        <TblInput cols={ACCOUNT_COLS} rows={d.accounts || []} onChange={(r) => f('accounts', r)} addLabel="Add account" />
      </div>

      <InfoBox type="tip" title="Recommended Account Naming Convention">
        Enforcing a prefix convention pays dividends for the entire life of the application:<br />
        <code>REV_</code> — Revenue (e.g., <code>REV_PRODUCT_SALES</code>, <code>REV_SERVICES</code>, <code>REV_IC_SALES</code>)<br />
        <code>EXP_</code> — Expense (e.g., <code>EXP_PERSONNEL</code>, <code>EXP_DEPRECIATION</code>, <code>EXP_INTEREST</code>)<br />
        <code>AST_</code> — Asset (e.g., <code>AST_CASH</code>, <code>AST_AR_TRADE</code>, <code>AST_PPE_NET</code>)<br />
        <code>LIA_</code> — Liability (e.g., <code>LIA_AP_TRADE</code>, <code>LIA_DEBT_LT</code>, <code>LIA_DEFERRED_REV</code>)<br />
        <code>EQ_</code> — Equity (e.g., <code>EQ_SHARE_CAPITAL</code>, <code>EQ_RETAINED_EARNINGS</code>, <code>EQ_CTA</code>)<br />
        <code>STAT_</code> — Statistical (e.g., <code>STAT_FTE_COUNT</code>, <code>STAT_UNITS_SOLD</code>)<br />
        <code>TOTAL_</code> or <code>HDR_</code> — Heading/Parent nodes
      </InfoBox>

      <InfoBox type="warning" title="Flow Type Mismatch is the Most Common Account Structure Error">
        The most frequent mistake in new implementations: assigning <strong>Balance</strong> flow type to a Revenue or Expense account, or <strong>Flow (P&amp;L)</strong> type to a Balance Sheet account.<br /><br />
        <strong>Wrong:</strong> <code>REV_PRODUCT_SALES</code> with Flow Type = Balance → Revenue accumulates forever, never resets, and completely distorts consolidated P&amp;L<br />
        <strong>Wrong:</strong> <code>AST_CASH</code> with Flow Type = Flow (P&amp;L) → Cash balance resets to zero every period, making the Balance Sheet meaningless<br /><br />
        Rule: if the account appears on the P&amp;L → Flow (P&amp;L). If it appears on the Balance Sheet → Balance (or AverageBalance/EndBalance for special cases).
      </InfoBox>
    </div>
  );
}
