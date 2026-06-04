import { generateApplicationProperties } from './appProperties';
import { generateApplicationSecurityRoles } from './securityRoles';
import { generateDataSources } from './dataSources';
import { generateTransformationRules } from './transformRules';
import { generateDataManagement } from './dataManagement';
import { generateWorkflowProfiles } from './workflowProfiles';
import { generateCertificationQuestions } from './certQuestions';

/**
 * All OneStream-importable XML files this tool can generate.
 * Each entry describes one file:
 *   filename    — the output filename (matches OneStream component name)
 *   label       — short display name
 *   description — where to import this in OneStream
 *   phase       — which implementation phase it belongs to
 *   generate    — function(project) → XML string
 */
export const GENERATORS = [
  {
    filename:    'ApplicationProperties.xml',
    label:       'Application Properties',
    description: 'Administration → Application → Properties → Import',
    phase:       'p1',
    generate:    generateApplicationProperties,
  },
  {
    filename:    'ApplicationSecurityRoles.xml',
    label:       'Application Security Roles',
    description: 'Administration → Application → Security → Import Roles',
    phase:       'p6',
    generate:    generateApplicationSecurityRoles,
  },
  {
    filename:    'DataSources.xml',
    label:       'Data Sources',
    description: 'Application → Data Integration → Data Sources → Import',
    phase:       'p4',
    generate:    generateDataSources,
  },
  {
    filename:    'TransformationRules.xml',
    label:       'Transformation Rules',
    description: 'Application → Data Integration → Transformation Rules → Import',
    phase:       'p4',
    generate:    generateTransformationRules,
  },
  {
    filename:    'DataManagement.xml',
    label:       'Data Management',
    description: 'Application → Data Integration → Data Management → Import',
    phase:       'p4',
    generate:    generateDataManagement,
  },
  {
    filename:    'WorkflowProfiles.xml',
    label:       'Workflow Profiles',
    description: 'Application → Workflow → Profiles → Import',
    phase:       'p5',
    generate:    generateWorkflowProfiles,
  },
  {
    filename:    'CertificationQuestions.xml',
    label:       'Certification Questions',
    description: 'Application → Close Management → Certification → Import',
    phase:       'p5',
    generate:    generateCertificationQuestions,
  },
];

/**
 * Returns all generated files as an array of { filename, content } objects.
 * Files whose generator throws are returned with an error comment as content.
 */
export function generateAllFiles(project) {
  return GENERATORS.map(({ filename, generate }) => {
    try {
      return { filename, content: generate(project) };
    } catch (err) {
      return {
        filename,
        content: `<?xml version="1.0" encoding="utf-8"?>\n<!-- ERROR generating ${filename}: ${err.message} -->`,
      };
    }
  });
}
