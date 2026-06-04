# OneStream Accelerator

A production-grade configuration design tool for OneStream Platform v9 implementations. This application guides implementation consultants and finance teams through every phase of a OneStream deployment — from application identity through security model — capturing all configuration decisions in a structured, exportable format.

---

## Overview

OneStream Accelerator eliminates the "blank whiteboard" problem at the start of every implementation engagement. Instead of starting from scratch with a spreadsheet or Word document, consultants use this tool to capture, validate, and export a complete application blueprint that can be handed directly to the configuration team.

**What it produces:**
- A complete configuration blueprint (saved locally in your browser)
- A human-readable summary of all design decisions
- A v9-compatible XML export covering all 19 configuration areas
- A reusable project file (.json) that can be shared between team members

---

## Quick Start

### Prerequisites

- [Node.js 18+](https://nodejs.org/) (LTS recommended)
- npm 9+ (included with Node.js)

### Installation

```bash
git clone https://github.com/your-org/onestream-accelerator.git
cd onestream-accelerator
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

### Build for Production

```bash
npm run build
npm run preview   # Preview the production build locally
```

The production build outputs to `dist/`. Deploy to any static hosting service (Azure Static Web Apps, AWS S3 + CloudFront, Netlify, etc.).

---

## Technology Stack

| Layer | Technology |
|---|---|
| Framework | React 18 |
| Build Tool | Vite 6 |
| Styling | Pure CSS (custom design system, no frameworks) |
| Icons | Tabler Icons (CDN) |
| Fonts | Inter, Syne, DM Mono (Google Fonts) |
| Persistence | Browser localStorage |
| Output | JSON, XML |

No backend required. All data is stored in the user's browser. The application runs entirely client-side.

---

## Project Structure

```
src/
├── main.jsx                    Entry point
├── App.jsx                     Root component — routing, state, validation
├── index.css                   Global design system styles
│
├── data/
│   └── constants.js            PHASES, STEPS, STEP_ORDER definitions
│
├── hooks/
│   └── useProject.js           localStorage persistence hook
│
├── utils/
│   ├── completion.js           Progress calculation
│   ├── validation.js           Required field validation per step
│   ├── xml.js                  Complete XML generation (all 19 steps)
│   └── download.js             JSON and XML file download utilities
│
└── components/
    ├── InfoBox.jsx             Contextual guidance component (info/tip/warning/critical)
    ├── TblInput.jsx            Dynamic table input component
    ├── Sidebar.jsx             Navigation with step completion indicators
    ├── OverviewPage.jsx        Project dashboard
    ├── OutputPage.jsx          Export / output view
    ├── SetupScreen.jsx         New project creation
    ├── SummaryView.jsx         Human-readable configuration summary
    └── steps/
        ├── index.js            Step component registry
        ├── StepAppProps.jsx    Application Properties
        ├── StepTimeProfile.jsx Time Profile
        ├── StepScenario.jsx    Scenario Setup
        ├── StepCurrency.jsx    Currency Setup
        ├── StepEntity.jsx      Entity Hierarchy
        ├── StepAccounts.jsx    Chart of Accounts
        ├── StepFlowDim.jsx     Flow Dimension
        ├── StepUdDims.jsx      UD1–UD8 Dimensions
        ├── StepCubeProps.jsx   Cube Properties
        ├── StepCubeDims.jsx    Cube Dimension Bindings
        ├── StepDataSource.jsx  Data Source Setup
        ├── StepTransform.jsx   Transformation Rules
        ├── StepLoadRules.jsx   Data Load Rules
        ├── StepWorkflow.jsx    Workflow Profiles
        ├── StepCertification.jsx  Certification Setup
        ├── StepTemplates.jsx   Data Collection Templates
        ├── StepUserGroups.jsx  User Groups
        ├── StepRoles.jsx       Role Assignments
        └── StepWorkflowSec.jsx Workflow Security
```

---

## Implementation Methodology

This tool follows a proven 6-phase OneStream implementation methodology. Complete phases in order — later phases depend on earlier configuration decisions.

### Phase 1 — Foundation

Establishes the non-negotiable structural parameters of the application.

| Step | Key Decisions | Common Mistakes |
|---|---|---|
| **Application Properties** | App ID (permanent), consolidation method, platform version | App ID with spaces or special characters; choosing wrong consolidation method |
| **Time Profile** | Fiscal year end, year range, period count | Start year too recent (no historical data); end year too close (runs out of years); 12 periods instead of 13 (no Period 0) |
| **Scenario Setup** | Actual, Budget, Forecast members; lock types | Actual scenario with No lock; missing scenario IDs; too many scenarios in Phase 1 |
| **Currency Setup** | All entity currencies; reporting currency; CTA method | Forgetting the CTA equity account; not adding all entity currencies |

> **Critical:** The Time Profile is permanent. Once data is loaded, changing the fiscal year end, period count, or year range requires a full application rebuild. Confirm these values with the client's Finance Director before proceeding.

### Phase 2 — Dimensions

Builds the analytical framework for the Financial Intelligence Cube (FIC).

| Step | Key Decisions | Common Mistakes |
|---|---|---|
| **Entity Hierarchy** | Legal entity tree; elimination entities; ICP entities; ownership % | Missing elimination entities; ICP entities not matching base entities |
| **Account Structure** | COA member names; account types; flow types; sign convention | Mixing flow types (Balance vs. Flow); missing system accounts (TOTAL_ASSETS, NET_INCOME, EQ_CTA) |
| **Flow Dimension** | Opening/Movements/Closing structure; translation methods | Applying flow to P&L accounts; insufficient flow members for BS analysis |
| **UD Dimensions** | UD1–UD3 active dimensions; UD4–UD8 reserved | Enabling too many UDs; no "Total" default member; enabling UD dimensions without business requirement |

> **Critical:** The Account dimension naming convention is permanent. Member names used in business rules, reports, and data loads cannot be changed without updating every reference. Use a consistent, meaningful prefix system from day one.

### Phase 3 — Cube Design

Configures the data storage containers and their dimensional structure.

| Step | Key Decisions | Common Mistakes |
|---|---|---|
| **Cube Properties** | Number of cubes; cube types; ICP enablement | Creating too many cubes; enabling ICP on planning cubes |
| **Cube Dimensions** | Required vs. optional dimensions; default members | Setting all dimensions as required (makes data entry complex); no default members for optional UDs |

### Phase 4 — Data & Integration

Defines how external data enters the platform.

| Step | Key Decisions | Common Mistakes |
|---|---|---|
| **Data Sources** | Connection types; naming convention; authentication method | Hardcoding passwords in connection strings (use XFCredential Vault) |
| **Transformation Rules** | Mapping method; source-to-target field mapping | No catch-all/unmapped rule (causes silent data load failures) |
| **Load Rules** | Load method (Merge/Replace); target cube and scenario | Using Accumulate incorrectly; no period clearing strategy |

### Phase 5 — Workflow & Process

Configures the period-end close management and planning input process.

| Step | Key Decisions | Common Mistakes |
|---|---|---|
| **Workflow Profiles** | Close steps; frequency; granularity | Over-engineered workflows with too many steps; too-granular workflow units |
| **Certification Setup** | Account reconciliation scope; due dates; owner groups | Certification due dates not aligned with close calendar |
| **Templates** | Budget/forecast input forms; input level; template type | Templates that are too complex or too wide; missing seeding from Actuals |

### Phase 6 — Security

Establishes the access control model before go-live.

| Step | Key Decisions | Common Mistakes |
|---|---|---|
| **User Groups** | Group structure; admin access levels | Too many System Admins; end users with configurator rights |
| **Role Assignments** | Permission matrix by group and object | Over-permissive default access; no member-level security for entity isolation |
| **Workflow Security** | Preparer/Reviewer/Approver assignments; scope | Same person can both prepare and approve (SoD violation) |

---

## Validation Rules

The application enforces the following required fields before allowing advancement to the next step:

| Step | Required Fields |
|---|---|
| Application Properties | Application Name, Application ID |
| Time Profile | Start Year, End Year, Period Frequency, Fiscal Year End, Number of Periods |
| Scenario Setup | At least one scenario row |
| Currency Setup | At least one currency row |
| Entity Hierarchy | Top-level entity name + at least one entity row |
| Account Structure | At least one account row |
| Cube Properties | At least one cube row |
| User Groups | At least one user group row |

Additional validation rules:
- Application ID: only letters, numbers, and underscores
- End Year must be greater than Start Year
- Start Year must be 2000 or later; End Year must not exceed 2060

---

## Data Persistence & Project Files

### How Data is Stored

All data is saved automatically to **browser localStorage** on every change. There is no server, no login, and no cloud sync. Data persists across browser sessions on the same device and browser.

**Storage key:** `os_accelerator_v1`

### Exporting Projects

**Save project file (.json):** Downloads a complete JSON snapshot of your project. Share this file with other team members — they can load it using "Load project file."

**Download XML:** Exports a v9-compatible XML configuration file covering all 19 configuration areas. This file can be used as the master configuration reference document for the implementation team.

### Import / Collaboration

Load a previously saved `.json` project file using the "Load project file" button on the Overview page. The application replaces the current project with the imported one.

> **Note:** Multiple users working on the same project should designate one person to maintain the master project file, or use version control (Git) on the exported JSON file.

---

## XML Export Format

The exported XML follows this top-level structure:

```xml
<?xml version="1.0" encoding="utf-8"?>
<OneStreamApplication>
  <ApplicationProperties />  <!-- Phase 1 -->
  <TimeProfile />
  <Scenarios />
  <Currencies />
  <EntityHierarchy />        <!-- Phase 2 -->
  <ChartOfAccounts />
  <FlowDimension />
  <UserDefinedDimensions />
  <Cubes />                  <!-- Phase 3 -->
  <CubeDimensionBindings />
  <DataSources />            <!-- Phase 4 -->
  <TransformationRules />
  <DataLoadRules />
  <WorkflowProfiles />       <!-- Phase 5 -->
  <Certifications />
  <DataCollectionTemplates />
  <UserGroups />             <!-- Phase 6 -->
  <RoleAssignments />
  <WorkflowSecurity />
</OneStreamApplication>
```

Sections are only included in the output if data has been entered for that step. Special characters in field values are XML-escaped automatically.

---

## OneStream Key Concepts Reference

### Financial Intelligence Cube (FIC)

OneStream's core data store. Every cube is a multi-dimensional intersection of:
- **Account** — Chart of Accounts (mandatory)
- **Entity** — Organizational hierarchy (mandatory)
- **Scenario** — Data isolation (mandatory)
- **Time** — Fiscal calendar (mandatory)
- **Consolidation Method** — Consol calculation layer (required for consolidation cubes)
- **Flow** — Balance sheet movement tracking (optional but recommended)
- **ICP** — Intercompany partner (optional, enables IC elimination)
- **UD1–UD8** — User-defined analytical dimensions (optional)

### Consolidation Methods

| Method | Description | Use Case |
|---|---|---|
| Ownership | Full consolidation at ownership % | Subsidiaries >50% owned |
| Equity | Net equity share only | Associates 20–50% owned |
| Proportional | Assets/liabilities at ownership % | Joint ventures |
| None | No consolidation | Dormant/informational entities |

### Account Types

| Type | Flow Type | Examples |
|---|---|---|
| Revenue | Flow (P&L) | Product Sales, Service Revenue |
| Expense | Flow (P&L) | Personnel, D&A, Marketing |
| Asset | Balance / EndBalance | Cash, Receivables, Fixed Assets |
| Liability | Balance / EndBalance | Payables, Debt, Provisions |
| Equity | Balance / EndBalance | Share Capital, Retained Earnings, CTA |
| Statistical | Flow | Headcount FTEs, Units Sold |

### Required System Accounts

Every OneStream application requires these accounts for consolidation to work correctly:
- `TOTAL_ASSETS` — top parent of all asset accounts
- `TOTAL_LIABILITIES` — top parent of all liability accounts
- `TOTAL_EQUITY` — includes Retained Earnings and CTA
- `NET_INCOME` — links P&L to Balance Sheet (Total Revenue − Total Expenses)
- `RETAINED_EARNINGS` — accumulates prior-year net income
- `EQ_CTA` — Cumulative Translation Adjustment (required for multi-currency)

---

## Development

### Adding a New Step

1. Add the step definition to `src/data/constants.js` in the appropriate PHASES array
2. Create `src/components/steps/StepYourName.jsx` following the existing pattern
3. Register the component in `src/components/steps/index.js`
4. Add any required field validation to `src/utils/validation.js`
5. Add XML generation for the new step in `src/utils/xml.js`

### Design System

CSS custom properties are defined in `src/index.css`:

```css
--bg, --bg2, --bg3          Background layers
--border, --border2          Border colors
--accent, --accent2          Primary brand blue
--text, --text2, --text3     Text hierarchy
--success, --warning, --danger  Status colors
--phase1 through --phase6   Phase-specific colors
--radius, --radius-lg        Border radius tokens
```

### InfoBox Component

Use the `InfoBox` component to add contextual guidance to any step:

```jsx
import InfoBox from '../InfoBox';

// Types: 'info' (blue), 'tip' (green), 'warning' (amber), 'critical' (red)
<InfoBox type="warning" title="Important">
  Your guidance text here. Supports <strong>HTML</strong> inline.
</InfoBox>
```

---

## Deployment

### Azure Static Web Apps

```yaml
# .github/workflows/azure-static-web-apps.yml
- name: Build and Deploy
  uses: Azure/static-web-apps-deploy@v1
  with:
    app_location: "/"
    api_location: ""
    output_location: "dist"
```

### Nginx (Self-Hosted)

```nginx
server {
    listen 80;
    root /var/www/onestream-accelerator/dist;
    index index.html;
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

---

## Disclaimer

This tool is designed to assist in the **planning and documentation** phase of a OneStream implementation. The XML output is a configuration blueprint — it is not directly importable into OneStream Platform. All configuration must be implemented by a certified OneStream consultant using the OneStream Platform administration interface.

OneStream is a registered trademark of OneStream Software LLC. This tool is not affiliated with or endorsed by OneStream Software LLC.

---

*Built for the world's leading OneStream implementation teams.*
