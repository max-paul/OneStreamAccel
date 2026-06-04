import { esc, osHeader, osFooter, ind } from './xmlEscape';

// Map our scenario types to the OneStream recognized scenarioType names
const SCEN_TYPE_MAP = {
  'Actual':           'Actual',
  'Budget':           'Budget',
  'Forecast':         'Forecast',
  'Rolling Forecast': 'Forecast',
  'Variance':         'Variance',
  'Elimination':      'Actual',
  'Statutory':        'Actual',
};

function prop(name, value, scenarioType = null, depth = 3) {
  const scAttr = scenarioType ? ` scenarioType="${esc(scenarioType)}"` : '';
  return `${ind(depth)}<property name="${esc(name)}"${scAttr} value="${esc(value)}" />`;
}

export function generateApplicationProperties(project) {
  const app  = project.steps?.['app-props']    || {};
  const time = project.steps?.['time-profile'] || {};
  const scen = project.steps?.['scenario']     || {};

  const scenarios     = scen.scenarios || [];
  const rawScenTypes  = scenarios.map(s => SCEN_TYPE_MAP[s.type] || s.type || 'Actual');
  const uniqueTypes   = ['Default', ...new Set(rawScenTypes)];
  const firstScenario = scenarios[0]?.id || scenarios[0]?.name || 'Actual';

  const lines = [
    ...osHeader(),
    `${ind(1)}<applicationPropertiesRoot>`,
    `${ind(2)}<applicationProperties>`,
    '',
    `${ind(3)}<!-- ── Global Application Settings ─────────────────────── -->`,
    prop('GlobalScenario', firstScenario),
    prop('GlobalTime', `${time.startYear || '2024'}M1`),
    prop('CompanyName', app.name || ''),
    prop('LogoFileName', ''),
    prop('LogoFileBytes', ''),
    prop('NumberFormat', '#,##0.0;'),
    prop('StartYear', time.startYear || '2020'),
    prop('EndYear',   time.endYear   || '2030'),
    prop('CurrencyFilter', ''),
    '',
    `${ind(3)}<!-- ── Per Scenario Type Overrides ─────────────────────── -->`,
    ...uniqueTypes.map(t => prop('EnforceGlobalPOV', 'false', t)),
    '',
    ...uniqueTypes.map(t => prop('AllowLoadsBeforeWFViewYear', 'false', t)),
    '',
    ...uniqueTypes.map(t => prop('AllowLoadsAfterWFViewYear', 'false', t)),
    '',
    ...uniqueTypes.map(t => prop('LockAfterCertify', 'false', t)),
    '',
    `${ind(3)}<!-- ── Report Formatting ───────────────────────────────── -->`,
    prop('ReportLogoHeight', '0'),
    prop('ReportLogoBottomMargin', '0'),
    prop('ReportTitleTopMargin', '0'),
    prop('ReportTitleFontFamily', 'Calibri'),
    prop('ReportTitleFontSize', '14'),
    prop('ReportTitleBold', 'true'),
    prop('ReportTitleItalic', 'false'),
    prop('ReportTitleTextColor', '0,0,0'),
    prop('ReportPageLabelTopMargin', '0'),
    prop('ReportPageLabelBottomMargin', '0'),
    prop('ReportPageLabelFontFamily', 'Calibri'),
    prop('ReportPageLabelFontSize', '11'),
    prop('ReportPageLabelBold', 'false'),
    prop('ReportPageLabelItalic', 'false'),
    prop('ReportPageLabelTextColor', '0,0,0'),
    prop('ReportHeaderBarBackgroundColor', '0,70,127'),
    prop('ReportHeaderLineColor', '0,0,0'),
    prop('ReportFooterFontFamily', 'Calibri'),
    prop('ReportFooterFontSize', '9'),
    prop('ReportFooterShowLine', 'true'),
    prop('ReportFooterShowDate', 'true'),
    prop('ReportFooterShowPageNum', 'true'),
    prop('ReportFooterText', app.name ? `${app.name} — Confidential` : ''),
    prop('ReportFooterLineColor', '0,0,0'),
    prop('ReportFooterTextColor', '0,0,0'),
    '',
    `${ind(2)}</applicationProperties>`,
    `${ind(1)}</applicationPropertiesRoot>`,
    ...osFooter(),
  ];

  return lines.join('\n');
}
