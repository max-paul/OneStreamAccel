import { esc, osHeader, osFooter, ind } from './xmlEscape';

const RISK_MAP = {
  'Account Reconciliation':  'High',
  'Workflow Sign-off':        'Medium',
  'Data Quality Check':       'Medium',
  'Intercompany Agreement':   'High',
  'Variance Explanation':     'Low',
  'Custom':                   'Medium',
};

const FREQ_MAP = {
  'Monthly':     'Monthly',
  'Quarterly':   'Quarterly',
  'Semi-Annual': 'Annual',
  'Annual':      'Annual',
};

export function generateCertificationQuestions(project) {
  const cert  = project.steps?.['certification'] || {};
  const certs = cert.certifications || [];
  const cube  = (project.steps?.['cube-props']?.cubes?.[0]?.cubeId) ||
                (project.steps?.['cube-props']?.cubes?.[0]?.name) || 'CubeName';

  // Group by scenario type (use 'Actual' for all unless specified)
  const scenarioType = 'Actual';

  const lines = [
    ...osHeader(),
    `${ind(1)}<certificationQuestionsRoot>`,
    '',
    `${ind(2)}<certificationGroups>`,
    '',
    `${ind(3)}<!-- ── Certification Groups ───────────────────────────────────────── -->`,
    `${ind(3)}<!-- Import via: Application → Close Management → Certification       -->`,
    '',
  ];

  if (certs.length === 0) {
    // Generate example group
    lines.push(`${ind(3)}<certificationGroup`);
    lines.push(`${ind(4)}name="BalanceSheetReconciliation"`);
    lines.push(`${ind(4)}description="Monthly balance sheet account certification"`);
    lines.push(`${ind(4)}scenarioTypeName="${scenarioType}"`);
    lines.push(`${ind(4)}accessGroup="Everyone"`);
    lines.push(`${ind(4)}maintenanceGroup="Administrators">`);
    lines.push(`${ind(4)}<certificationQuestions>`);
    lines.push(`${ind(5)}<certificationQuestion`);
    lines.push(`${ind(6)}name="BSReconciliation_Example"`);
    lines.push(`${ind(6)}category="Balance Sheet Reconciliation"`);
    lines.push(`${ind(6)}riskLevel="High"`);
    lines.push(`${ind(6)}requirementFrequency="Monthly"`);
    lines.push(`${ind(6)}timeFilterForReqtFreq=""`);
    lines.push(`${ind(6)}text="I confirm that the account balance as reported in OneStream has been reconciled to supporting documentation and is accurate and complete."`);
    lines.push(`${ind(6)}responseOptional="false"`);
    lines.push(`${ind(6)}deactivated="false"`);
    lines.push(`${ind(6)}deactivatedDate=""`);
    lines.push(`${ind(6)}displayOrder="10" />`);
    lines.push(`${ind(4)}</certificationQuestions>`);
    lines.push(`${ind(3)}</certificationGroup>`);
    lines.push('');
  } else {
    let order = 10;
    for (const certDef of certs) {
      const groupName = (certDef.name || 'Certification').replace(/\s+/g, '_').replace(/[^A-Za-z0-9_]/g, '');
      const riskLevel = RISK_MAP[certDef.type] || 'Medium';
      const freq      = FREQ_MAP[certDef.freq] || 'Monthly';

      // Standard reconciliation question text based on type
      const questionTexts = {
        'Account Reconciliation':
          `I confirm that the account balance for "${certDef.name}" as reported in OneStream has been reconciled to the underlying subledger or supporting documentation. The balance is accurate, complete, and I am satisfied with the presentation.`,
        'Workflow Sign-off':
          `I confirm that all required workflow steps for "${certDef.name}" have been completed, data has been reviewed for completeness and accuracy, and I authorize the submission of this period's data.`,
        'Data Quality Check':
          `I confirm that data loaded for "${certDef.name}" has been validated against source system totals, no material discrepancies exist, and the data is complete and accurate for this period.`,
        'Intercompany Agreement':
          `I confirm that the intercompany balances for "${certDef.name}" have been agreed with the counterparty. Discrepancies, if any, have been identified, documented, and are in the process of resolution.`,
        'Variance Explanation':
          `I confirm that all material variances for "${certDef.name}" vs. budget/prior year have been reviewed and adequately explained in the commentary section.`,
        'Custom':
          `I confirm completion of "${certDef.name}" and certify that this process has been completed in accordance with the organization's policies and procedures.`,
      };

      const qText = questionTexts[certDef.type] || questionTexts['Custom'];

      lines.push(`${ind(3)}<certificationGroup`);
      lines.push(`${ind(4)}name="${groupName}"`);
      lines.push(`${ind(4)}description="${esc(certDef.name || '')}"`);
      lines.push(`${ind(4)}scenarioTypeName="${scenarioType}"`);
      lines.push(`${ind(4)}accessGroup="Everyone"`);
      lines.push(`${ind(4)}maintenanceGroup="Administrators">`);
      lines.push(`${ind(4)}<certificationQuestions>`);
      lines.push(`${ind(5)}<certificationQuestion`);
      lines.push(`${ind(6)}name="${groupName}_Cert"`);
      lines.push(`${ind(6)}category="${esc(certDef.type || 'General')}"`);
      lines.push(`${ind(6)}riskLevel="${riskLevel}"`);
      lines.push(`${ind(6)}requirementFrequency="${freq}"`);
      lines.push(`${ind(6)}timeFilterForReqtFreq=""`);
      lines.push(`${ind(6)}text="${esc(qText)}"`);
      lines.push(`${ind(6)}responseOptional="false"`);
      lines.push(`${ind(6)}deactivated="false"`);
      lines.push(`${ind(6)}deactivatedDate=""`);
      lines.push(`${ind(6)}displayOrder="${order}" />`);
      lines.push(`${ind(4)}</certificationQuestions>`);
      lines.push(`${ind(3)}</certificationGroup>`);
      lines.push('');
      order += 10;
    }
  }

  lines.push(`${ind(2)}</certificationGroups>`);
  lines.push('');

  // Certification Profiles — link cert groups to cube/entities
  lines.push(`${ind(2)}<certificationProfiles>`);
  lines.push('');
  lines.push(`${ind(3)}<!-- ── Certification Profile ── -->`);
  lines.push(`${ind(3)}<!-- Links certification groups to the cube and entity scope -->`);
  lines.push('');

  const profileName = `${cube}_CertProfile`;
  lines.push(`${ind(3)}<certificationProfile`);
  lines.push(`${ind(4)}name="${esc(profileName)}"`);
  lines.push(`${ind(4)}description="Certification profile for ${esc(cube)} cube"`);
  lines.push(`${ind(4)}cubeName="${esc(cube)}"`);
  lines.push(`${ind(4)}scenarioTypeName="${scenarioType}"`);
  lines.push(`${ind(4)}accessGroup="Everyone"`);
  lines.push(`${ind(4)}maintenanceGroup="Administrators">`);
  lines.push(`${ind(4)}<members>`);

  if (certs.length === 0) {
    lines.push(`${ind(5)}<member name="BalanceSheetReconciliation" />`);
  } else {
    for (const certDef of certs) {
      const groupName = (certDef.name || 'Certification').replace(/\s+/g, '_').replace(/[^A-Za-z0-9_]/g, '');
      lines.push(`${ind(5)}<member name="${groupName}" />`);
    }
  }

  lines.push(`${ind(4)}</members>`);
  lines.push(`${ind(3)}</certificationProfile>`);
  lines.push('');
  lines.push(`${ind(2)}</certificationProfiles>`);
  lines.push('');
  lines.push(`${ind(1)}</certificationQuestionsRoot>`);
  lines.push(...osFooter());

  return lines.join('\n');
}
