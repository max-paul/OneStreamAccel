# OneStream Accelerator

> **Free, open-source configuration design and export tool for OneStream Platform v9 implementations.**
> Built by OneStream consultants, for OneStream consultants.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-blue?style=for-the-badge&logo=github)](https://max-paul.github.io/OneStreamAccel/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

---

## 🚀 Try It Now — No Install Required

**[https://max-paul.github.io/OneStreamAccel/](https://max-paul.github.io/OneStreamAccel/)**

Works in any modern browser. No login. No data leaves your machine. Free forever.

---

## What Is OneStream Accelerator?

**OneStream Accelerator** is a structured configuration wizard for **OneStream Platform v9** implementations. It guides consultants and finance teams through all 19 configuration areas — from Application Properties to Security — capturing every design decision with built-in expert guidance, validating required fields, and exporting files that can be imported directly into a live OneStream environment.

If you've ever started a new OneStream engagement and spent the first week building a configuration tracker spreadsheet from scratch, this tool eliminates that entirely.

### Who Is This For?

- **OneStream implementation consultants** — capture client design decisions in a structured, exportable format from day one
- **Finance systems teams** — document your OneStream application configuration for audit, maintenance, and onboarding
- **OneStream administrators** — design and validate configuration changes before applying them to production
- **Students and learners** — understand how a OneStream application is structured with step-by-step guidance on every decision

---

## Key Features

### ✅ Expert Guidance at Every Step
Every configuration screen includes authoritative implementation guidance drawn from real-world enterprise OneStream deployments — including common mistakes, best practice recommendations, and critical warnings on permanent decisions (like the Time Profile, which cannot be changed after go-live).

### ✅ Column-Level Documentation
Every table input has an expandable **Column Guide** — a field-by-field reference explaining what each column means, why it matters in OneStream, and a full glossary of every dropdown option with its real-world implications.

### ✅ Export Gate with Default Value Detection
The tool tracks which steps you've visited and detects when values haven't changed from pre-populated defaults. Before allowing export, it requires you to either configure each required step or explicitly confirm that the default values are correct for your implementation.

### ✅ 7 Directly Importable OneStream XML Files
The **OneStream Import Files** tab generates 7 files in the exact `OneStreamXF v9.3` format — these are not documentation, they are directly importable into a OneStream environment via the standard import wizard.

### ✅ Complete Design Specification XML
A full human-readable XML blueprint covering all 19 configuration areas — suitable as a master reference document for the implementation team.

### ✅ Sharable Project Files
Save your project as `.json` and share with teammates. Anyone can load it on any machine to continue working. No account required.

---

## The 19 Configuration Steps

### Phase 1 — Foundation
| Step | What You Configure |
|---|---|
| Application Properties | App name, Application ID, consolidation method, platform version, industry, go-live target |
| Time Profile | Fiscal year range, period frequency, fiscal year end, calendar type, Period 0 |
| Scenario Setup | Scenario members (Actual/Budget/Forecast), lock types, ICP enablement, default views |
| Currency Setup | All entity currencies, reporting currency, FX translation method, rate types |

### Phase 2 — Dimensions
| Step | What You Configure |
|---|---|
| Entity Hierarchy | Full legal/management entity tree, elimination entities, ICP entities, ownership %, consol methods |
| Account Structure | Chart of accounts with types, flow types, sign convention, ICP flags, input flags |
| Flow Dimension | Opening/movement/closing members, translation methods per flow member |
| UD1–UD8 Dimensions | User-defined analytical dimensions (Cost Center, Product, Project, etc.) |

### Phase 3 — Cube Design
| Step | What You Configure |
|---|---|
| Cube Properties | Cube IDs, types, ICP enablement |
| Cube Dimensions | Dimension bindings per cube, required vs. optional, default members |

### Phase 4 — Data & Integration
| Step | What You Configure |
|---|---|
| Data Sources | Connector types, authentication methods, connection references |
| Transformation Rules | Source-to-OneStream dimension mappings with catch-all rules auto-generated |
| Data Load Rules | Load method (Merge/Replace/Accumulate), target cube/scenario, clear strategy |

### Phase 5 — Workflow & Process
| Step | What You Configure |
|---|---|
| Workflow Profiles | Close management profiles, frequencies, granularity levels |
| Certification Setup | Balance sheet reconciliation profiles with SOX-quality question text |
| Data Collection Templates | Budget/forecast input templates, input levels, seeding strategy |

### Phase 6 — Security
| Step | What You Configure |
|---|---|
| User Groups | Standard 5-group model (System Admin, Configurator, Process Owner, Standard User, Read Only) |
| Role Assignments | Application, cube, workflow, dashboard, and member-level permissions |
| Workflow Security | Preparer/Reviewer/Approver role assignments with SoD documentation |

---

## OneStream Import Files

Seven files generated in the exact `OneStreamXF version="9.3.0.18429"` format:

| File | Import Location in OneStream |
|---|---|
| `ApplicationProperties.xml` | Administration → Application → Properties |
| `ApplicationSecurityRoles.xml` | Administration → Application → Security |
| `DataSources.xml` | Application → Data Integration → Data Sources |
| `TransformationRules.xml` | Application → Data Integration → Transformation Rules |
| `DataManagement.xml` | Application → Data Integration → Data Management |
| `WorkflowProfiles.xml` | Application → Workflow → Profiles |
| `CertificationQuestions.xml` | Application → Close Management → Certification |

> Dimension member data (Accounts, Entities, Flow, UDs) is loaded separately via **Dimension Management → Load Members** — CSV/Excel imports native to OneStream.

---

## Getting Started (Local Development)

### Prerequisites
- [Node.js 18+](https://nodejs.org/)
- npm 9+

```bash
git clone https://github.com/max-paul/OneStreamAccel.git
cd OneStreamAccel
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

```bash
npm run build      # Production build → dist/
npm run preview    # Preview production build locally
```

---

## Project Structure

```
src/
├── main.jsx                     Entry point + ErrorBoundary
├── App.jsx                      Root — routing, navigation, touch tracking
├── index.css                    Design system (CSS custom properties)
├── data/constants.js            Phase and step definitions
├── hooks/useProject.js          localStorage persistence
├── utils/
│   ├── completion.js            Progress calculation
│   ├── validation.js            Required field validation
│   ├── stepDefaults.js          Default value detection (for export gate)
│   ├── exportReadiness.js       Per-step export readiness logic
│   ├── xml.js                   Design-spec XML (all 19 steps)
│   ├── download.js              Download utilities
│   └── generators/              OneStreamXF-format XML generators
│       ├── appProperties.js     → ApplicationProperties.xml
│       ├── securityRoles.js     → ApplicationSecurityRoles.xml
│       ├── dataSources.js       → DataSources.xml
│       ├── transformRules.js    → TransformationRules.xml
│       ├── dataManagement.js    → DataManagement.xml
│       ├── workflowProfiles.js  → WorkflowProfiles.xml
│       └── certQuestions.js     → CertificationQuestions.xml
└── components/
    ├── InfoBox.jsx              Guidance callout component
    ├── ColumnGuide.jsx          Collapsible column-by-column reference
    ├── ExportReadiness.jsx      Export gate with per-step status
    ├── TblInput.jsx             Dynamic table input
    └── steps/                   19 step components
```

---

## Tech Stack

| | |
|---|---|
| **Framework** | React 18 |
| **Build** | Vite 6 |
| **Styling** | Pure CSS — no UI framework |
| **Icons** | Tabler Icons |
| **Fonts** | Inter · Syne · DM Mono |
| **Persistence** | Browser localStorage |
| **Hosting** | GitHub Pages |

---

## Deployment

The app deploys automatically to GitHub Pages on every push to `main`.

**Live:** [https://max-paul.github.io/OneStreamAccel/](https://max-paul.github.io/OneStreamAccel/)

To deploy your own fork:
1. Fork this repository
2. Go to **Settings → Pages → Source: GitHub Actions**
3. Push to `main` — done

---

## Feedback & Contributing

**Found a bug? Have a feature request? Want to add guidance for a step?**

👉 **[Open an issue on GitHub](https://github.com/max-paul/OneStreamAccel/issues/new)**

All feedback is welcome — especially from practicing OneStream consultants who can spot incorrect guidance, missing fields, or edge cases from real engagements.

### Ways to contribute

- **Report incorrect OneStream guidance** — if something in an InfoBox or Column Guide is wrong or outdated for your version, open an issue
- **Suggest missing fields** — if a step is missing a configuration option you use on real engagements, open an issue or PR
- **Add a new XML generator** — the `src/utils/generators/` folder makes it easy to add new importable file types
- **Improve default values** — if the pre-populated scenario/flow/user group defaults don't reflect best practices for your industry, suggest better ones
- **Share your use case** — even just leaving a comment on an issue saying how you use this helps prioritize future work

### Development

```bash
git clone https://github.com/max-paul/OneStreamAccel.git
cd OneStreamAccel
npm install
npm run dev
```

Adding a new configuration step:
1. Add definition to `src/data/constants.js`
2. Create `src/components/steps/StepYourName.jsx` — use `InfoBox` and `ColumnGuide`
3. Register in `src/components/steps/index.js`
4. Add validation to `src/utils/validation.js`
5. Add to `src/utils/xml.js` (design spec) and `src/utils/generators/` (OneStream format)

---

## OneStream Implementation Reference

### Required System Accounts

Every OneStream consolidation application requires these accounts or the Balance Sheet equation will not hold:

| Account Member | Type | Purpose |
|---|---|---|
| `TOTAL_ASSETS` | Heading | Top parent of all asset accounts |
| `TOTAL_LIABILITIES` | Heading | Top parent of all liability accounts |
| `TOTAL_EQUITY` | Heading | Parent of Retained Earnings + CTA + reserves |
| `NET_INCOME` | Calculated | Links P&L to Balance Sheet — Total Revenue minus Total Expenses |
| `RETAINED_EARNINGS` | Equity | Accumulates prior-year net income each year |
| `EQ_CTA` | Equity | Cumulative Translation Adjustment — required for multi-currency |

### Critical Implementation Rules

| Rule | Why It Matters |
|---|---|
| Time Profile is permanent | Cannot be changed after data is loaded without a full application rebuild |
| App ID cannot change | Used throughout business rules, APIs, and integrations |
| Account member names are permanent | Referenced in rules, reports, and data loads — renaming breaks everything |
| Actual scenario must have Period lock | Protects historical data from accidental modification — SOX control point |
| Every consol node needs an Elimination entity | Without it, intercompany transactions will not eliminate |
| CTA account required for multi-currency | Without it, the Balance Sheet will not balance after FX translation |
| No System Admin for end users | OneStream sysadmin can delete cubes, export all data, impersonate any user |
| Preparer ≠ Approver (SoD) | Standard SOX / ICFR Segregation of Duties requirement |

---

## Frequently Asked Questions

**Is this officially supported by OneStream Software?**
No. This is an independent open-source tool. OneStream is a registered trademark of OneStream Software LLC. This project is not affiliated with or endorsed by OneStream Software LLC.

**Can the generated XML files really be imported into OneStream?**
Yes — the 7 files in the **OneStream Import Files** tab are generated in the exact `OneStreamXF v9.3.0.18429` format used by OneStream's import wizard. Dimension member data (accounts, entities, etc.) uses a separate CSV/Excel import via Dimension Management.

**Does this support OneStream v8.x?**
The XML format is targeted at v9.3. Most configuration concepts are identical across v8 and v9, but some element names or attribute values may differ. Review generated files before importing into a v8 environment.

**Is my data secure?**
All data is stored exclusively in your browser's localStorage. Nothing is sent to any server. The application has no backend, no analytics, and no telemetry.

**Can multiple people work on the same project?**
Export the `.json` project file and share it. Anyone can load it via the "Load project file" button. For team workflows, commit the JSON file to your Git repository alongside the codebase.

**What happens if I reload the page?**
Your project is automatically saved to localStorage on every change. It will still be there after reloading, closing the tab, or restarting the browser — on the same device and browser.

---

## License

MIT — free to use, modify, and distribute. See [LICENSE](LICENSE) for details.

---

*Built for the OneStream consulting community. If this saves you time on an engagement, consider starring the repo or sharing it with a colleague.*

[![Star on GitHub](https://img.shields.io/github/stars/max-paul/OneStreamAccel?style=social)](https://github.com/max-paul/OneStreamAccel)
