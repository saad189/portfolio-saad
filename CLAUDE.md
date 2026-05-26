# Portfolio Saad — Angular Implementation Guide

## What this is

Implementing a personal portfolio for Saad Ahmed (Senior Full-Stack Engineer) in an existing Angular project.
The pixel-perfect reference design lives at: `../portfolio-design/project/Portfolio.standalone-src.html`

**Read that file top-to-bottom before touching anything.** It is a single self-contained HTML file with all CSS tokens, markup, classes, and JS behavior spelled out. Every class name, color value, and layout rule you need is in there. Do not invent anything — match it.

---

## Project location

```
/Users/saadahmed/Desktop/portfolio-saad/
```

Angular CLI project, Angular Material installed, Firebase hosting configured.

---

## What already exists (do not delete or restructure the file tree)

| File | Status | Notes |
|---|---|---|
| `src/Components/header/` | Rebuild | Has content, wrong design |
| `src/Components/footer/` | Rebuild | Has content, wrong design |
| `src/Components/credentials/credentials.component.*` | Keep + extend | Good structure, has cert data |
| `src/Components/credentials/certificate-item/` | Keep + update styles | Template is correct, needs CSS update to match design |
| `src/Components/dashboard/dashboard.component.*` | Rebuild | Just placeholders |
| `src/Components/experience/experience.component.*` | Rebuild | Just a placeholder |
| `src/Components/experience/job-item/` | Rebuild | Just a placeholder |
| `src/Components/projects/projects.component.*` | Rebuild | Just a placeholder |
| `src/Components/projects/project-item/` | Rebuild | Just a placeholder |
| `src/Components/about/` | Can be removed or ignored | Not used in new structure |
| `src/Components/contact/` | Rebuild | Just a placeholder |
| `src/shared/interfaces.ts` | Extend | Has Education, Certificate, Experience already |
| `src/shared/shared.module.ts` | Extend | Add new shared components here |
| `src/Directives/fragment-link.directive.ts` | Keep | Used for nav active state |
| `src/styles.scss` | Extend | Add design tokens here |

---

## Architecture decisions

### 1. Routing — collapse to single-page

**Current (wrong):** `/main`, `/experience`, `/credentials` are separate routes.

**New (correct):** Everything lives in `/main`. Navigation uses Angular fragment scrolling.

```typescript
// app-routing.module.ts — final state
const routes: Routes = [
  { path: '', redirectTo: 'main', pathMatch: 'full' },
  { path: 'main', component: DashboardComponent },
  { path: '**', redirectTo: 'main' }
];
```

All nav links use `routerLink="/main"` with a `[fragment]` binding:
```html
<a routerLink="/main" fragment="experience">Experience</a>
```

### 2. DashboardComponent is the page orchestrator

`DashboardComponent` renders every section in order:

```html
<!-- dashboard.component.html -->
<app-hero></app-hero>
<app-skills></app-skills>
<app-experience></app-experience>
<app-projects></app-projects>
<app-education></app-education>
<app-credentials></app-credentials>
<app-contact></app-contact>
```

### 3. All data lives in one file

Create `src/shared/portfolio.data.ts`. All content (jobs, projects, skills, education, certs) is typed const arrays. Components inject `PortfolioService` which reads from this file. **No hardcoded strings in templates.**

### 4. Standalone components throughout

Use `standalone: true` on all components. Some existing ones (job-item, project-item) use the old NgModule pattern — convert them when rebuilding.

---

## Step-by-step build order

### Phase 1 — Design tokens

Add to `src/styles.scss` (copy exactly from the reference HTML `<style>` block — `:root` vars through `.reveal` animation class):

- All CSS custom properties (colors, fonts, spacing, shadows, radii)
- `.glass-card` class + hover state
- `.pill` and all pill variants (`.pill--metric`, `.pill--gold`, `.pill--accent`, `.pill--featured`, `.pill--current`)
- `.reveal` / `.visible` scroll-entry animation
- Responsive breakpoints (`@media max-width: 960px`, `768px`, `480px`)

Also:
- Add `@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap');` to `src/index.html` `<head>`
- Copy `1709517711049.jpeg` → `src/assets/profile.jpg`

### Phase 2 — Shared atoms (`src/shared/components/`)

Create three tiny standalone components and export from `SharedModule`:

**`PillTagComponent`** (`app-pill-tag`)
- `@Input() label: string`
- `@Input() variant: 'default' | 'metric' | 'gold' | 'accent' | 'featured' | 'current' = 'default'`
- Template: `<span class="pill" [ngClass]="variantClass">{{ label }}</span>`
- `variantClass` computed from variant input

**`StatPillComponent`** (`app-stat-pill`)
- `@Input() value: string`
- `@Input() label: string`
- Template: `<span class="pill pill--metric"><strong>{{ value }}</strong>&nbsp;{{ label }}</span>`

**`SectionHeaderComponent`** (`app-section-header`)
- `@Input() eyebrow: string`
- `@Input() title: string`
- `@Input() subtitle?: string`
- Template matches `.section-head` block in the reference HTML

### Phase 3 — Data layer

**Extend `src/shared/interfaces.ts`** — add:

```typescript
export interface Job {
  company: string;
  role: string;
  duration: string;
  tenure?: string;
  location: string;
  description: string;
  stats?: string[];         // plain strings for pill--metric display
  techTags: string[];
  isCurrent?: boolean;
  isPast?: boolean;         // drives .past class on timeline-item
}

export interface Project {
  title: string;
  subtitle?: string;        // e.g. "— Dubizzle Labs"
  description: string;
  tag: string;              // pill label: 'Featured' | 'Enterprise' | 'IoT'
  tagVariant: 'featured' | 'accent';
  stats?: string[];
  techTags: string[];
  links?: { label: string; href: string }[];
  isFeatured?: boolean;
}

export interface SkillCategory {
  label: string;            // 'Frontend' | 'Backend & Data' | 'Cloud & DevOps'
  heading: string;          // e.g. 'Interfaces & experience'
  iconSvg: string;          // raw SVG string
  skills: string[];
}
```

**Create `src/shared/portfolio.data.ts`** with these exact const arrays:

```typescript
export const JOBS: Job[] = [
  {
    company: 'Motive', role: 'Software Engineer',
    duration: 'Jan 2026 — Present', location: 'Lahore, Pakistan',
    description: 'Working on AI-based documentation analysis systems — improving tooling for how engineering teams handle compliance and technical docs.',
    techTags: ['AI', 'Documentation', 'Full-Stack'],
    isCurrent: true
  },
  {
    company: 'Glotte', role: 'Lead Software Engineer / CTO',
    duration: 'May 2024 — Jan 2026', tenure: '1 yr 9 mos', location: 'Doha, Qatar',
    description: 'Architected and built the core product from scratch — mobile app (React Native / Expo), backend (NestJS + MySQL + Redis + Elasticsearch), and cloud infrastructure (AWS + Railway). Led launch on Apple App Store and Google Play, including federated auth (Apple/Google Sign-In) and a RevenueCat subscription system with multi-tier plans.',
    stats: ['App Store + Play Store', 'Built from 0'],
    techTags: ['React Native', 'NestJS', 'MySQL', 'Redis', 'Elasticsearch', 'AWS', 'RevenueCat']
  },
  {
    company: 'Dubizzle Labs', role: 'Software Engineer · Full Stack',
    duration: 'May 2021 — Apr 2023', tenure: '2 yrs', location: 'Lahore, Pakistan',
    description: 'Worked on Salesforce — Zameen\'s internal CRM — used by 4,000+ active users across 4 companies. Improved the lead generation module (50% reduction in submission time), redesigned reporting and staff modules (20% load-time improvement), and led a codebase refactor achieving 90%+ code coverage and 2× component performance.',
    stats: ['4,000+ users', '50% faster lead flow', '2× perf gain', '90%+ coverage'],
    techTags: ['Angular', 'Node.js', 'Sequelize', 'MySQL', 'Redis', 'AWS']
  },
  {
    company: 'Ciklum', role: 'Software Engineer · Full Stack',
    duration: 'Jun 2019 — Nov 2020', tenure: '1.5 yrs', location: 'Islamabad, Pakistan',
    description: 'Built location tracking and geographical-compliance features for an IoT management system in the maritime industry. Worked with transnational teams using Agile / Scrum, interfaced with clients in requirements analysis, and developed report-extraction features using Linux bash scripting.',
    techTags: ['Angular', '.NET Core', 'PostGIS', 'TimeSeries SQL', 'Azure', 'Docker'],
    isPast: true
  }
];

export const PROJECTS: Project[] = [
  {
    title: 'Glotte — Cross-Platform Product',
    description: 'Architected and shipped a full consumer mobile product from zero: React Native app (iOS + Android), NestJS backend, MySQL + Redis + Elasticsearch data layer, AWS + Railway cloud infra, and a RevenueCat subscription system. Launched on both app stores.',
    tag: 'Featured', tagVariant: 'featured',
    stats: ['iOS + Android', 'Full-stack ownership', 'Launched 2024'],
    techTags: ['React Native', 'NestJS', 'MySQL', 'Redis', 'Elasticsearch', 'AWS', 'RevenueCat'],
    links: [{ label: 'GitHub ↗', href: '#' }, { label: 'App Store ↗', href: '#' }],
    isFeatured: true
  },
  {
    title: 'Zameen CRM', subtitle: '— Dubizzle Labs',
    description: 'Enhanced internal CRM serving 4,000+ users across 4 companies. Rebuilt reporting modules, improved lead flow by 50%, led full codebase refactor with 90%+ test coverage.',
    tag: 'Enterprise', tagVariant: 'accent',
    stats: ['4,000+ users', '50% faster'],
    techTags: ['Angular', 'Node.js', 'MySQL', 'Redis', 'AWS']
  },
  {
    title: 'Maritime IoT Platform', subtitle: '— Ciklum',
    description: 'Location tracking and geographical-compliance system for remotely managing vessels in a B2B maritime context. Multi-service architecture on Linux / Azure with PostGIS spatial databases.',
    tag: 'IoT', tagVariant: 'accent',
    techTags: ['Angular', '.NET Core', 'PostGIS', 'Azure', 'Docker']
  }
];

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    label: 'Frontend', heading: 'Interfaces & experience',
    iconSvg: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>`,
    skills: ['Angular', 'TypeScript', 'SCSS', 'React Native', 'HTML / CSS', 'RxJS', 'ng2-charts']
  },
  {
    label: 'Backend & Data', heading: 'Systems & persistence',
    iconSvg: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="6" rx="1.5"></rect><rect x="2" y="11" width="20" height="6" rx="1.5"></rect><line x1="6" y1="6" x2="6.01" y2="6"></line><line x1="6" y1="14" x2="6.01" y2="14"></line><line x1="2" y1="19" x2="22" y2="19"></line></svg>`,
    skills: ['Node.js', 'NestJS', '.NET Core', 'C#', 'Python', 'MySQL', 'PostgreSQL', 'Redis', 'Elasticsearch', 'Sequelize', 'TypeORM', 'JEST']
  },
  {
    label: 'Cloud & DevOps', heading: 'Infra & delivery',
    iconSvg: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path></svg>`,
    skills: ['AWS (Cognito, S3)', 'Azure', 'Docker', 'Git', 'Azure Boards', 'Railway', 'CI / CD', 'Agile (Scrum, Kanban)', 'Prompt Engineering']
  }
];

export const CURRENT_WORKING_WITH = ['AI-Driven Development', 'LLM Integration', 'Documentation Analysis'];

export const EDUCATION: Education[] = [
  {
    university: { name: 'Lahore University of Management Sciences', link: '', iconUrl: '' },
    shortName: 'LUMS',
    programName: 'MS — Technology Management & Entrepreneurship',
    description: 'Thesis: Best Practices in Project Management, Documentation & Compliance.',
    startDate: 'Jul 2022', endDate: 'Jun 2024',
    courses: ['Operations Management', 'Data Analysis', 'Technology Entrepreneurship']
  },
  {
    university: { name: 'National University of Computer & Emerging Sciences', link: '', iconUrl: '' },
    shortName: 'FAST',
    programName: 'BS — Computer Science',
    description: '',
    startDate: 'Aug 2015', endDate: 'Jun 2019',
    courses: ['Web Programming', 'UI / UX', 'Mobile Computing', 'Distributed Computing'],
    honors: ['Bronze Medal — Academic Excellence', "Dean's List · Spring '16 & '17"]
  }
];

// Move the existing cert data from credentials.component.ts here
export const CERTIFICATES: Certificate[] = [
  {
    name: 'Microsoft Certified: Azure Fundamentals',
    url: 'https://learn.microsoft.com/en-us/users/saadahmed-6949/credentials/5971717db08b6eef',
    iconUrl: 'https://learn.microsoft.com/favicon.ico',
    completionDate: 'May 2020', offeredOrg: 'Microsoft',
    description: 'Credential ID: 5971717DB08B6EEF',
    isVerified: true
  },
  {
    name: 'SQL for Beginners — Learn SQL using MySQL & Database Design',
    url: 'https://www.udemy.com/certificate/UC-f2f9ad82-584a-4109-8d05-078021b60ef4/',
    iconUrl: '', completionDate: 'May 2020', offeredOrg: 'Udemy'
  },
  {
    name: 'C# Advanced Topics — Prepare for Technical Interviews',
    url: 'https://www.udemy.com/certificate/UC-e1fdbe40-faa6-4f9c-a126-edba24e77d13/',
    iconUrl: '', completionDate: 'May 2020', offeredOrg: 'Udemy'
  },
  {
    name: 'Mastering LINQ with C# and .NET',
    url: 'https://www.udemy.com/certificate/UC-1C3VVRGF/',
    iconUrl: '', completionDate: '2020', offeredOrg: 'Udemy'
  }
];
```

**Create `src/shared/portfolio.service.ts`**:
```typescript
@Injectable({ providedIn: 'root' })
export class PortfolioService {
  getJobs() { return JOBS; }
  getProjects() { return PROJECTS; }
  getSkillCategories() { return SKILL_CATEGORIES; }
  getCurrentWorkingWith() { return CURRENT_WORKING_WITH; }
  getEducation() { return EDUCATION; }
  getCertificates() { return CERTIFICATES; }
}
```

Also add `shortName`, `courses`, `honors` fields to the `Education` interface, and `isVerified` to `Certificate`.

### Phase 4 — Header

Rebuild `header.component.html` to match the `<header class="site-header">` block in the reference exactly.

Key behaviors:
- `@HostListener('window:scroll')` — adds `.scrolled` class to host element when `window.scrollY > 20`
- Resume button opens `assets/Resume_SaadAhmed.pdf` in new tab
- Hamburger button → emit an event or call a shared service to open the Angular Material sidenav that's already in `app.component.html`
- Nav links: `routerLink="/main"` + `fragment="experience"` etc.

### Phase 5 — Footer

Rebuild `footer.component.html` to match `<footer class="site-footer">` in the reference. Three-column grid, real links, copyright bottom bar.

### Phase 6 — HeroComponent (new)

Create `src/Components/hero/hero.component.*`

Section ID `#about`. Matches `<section class="hero" id="about">` in reference exactly:
- Green dot eyebrow line
- Large monospace name
- Tagline + bio with `<strong>` highlights
- Two path cards (Employment indigo, Freelance amber)
- Tech stack pills row
- Profile photo (`src/assets/profile.jpg`) with circular crop and glow — replace the placeholder `<div>` with an `<img>`

### Phase 7 — SkillsComponent

Rebuild `dashboard.component.html`'s skills placeholder. Actually create `src/Components/skills/skills.component.*`

Inject `PortfolioService`, use `getSkillCategories()`. Use `*ngFor` over categories to render `<app-skill-category-card>` components.

Create `src/Components/skills/skill-category-card/` — takes `@Input() category: SkillCategory`, renders the `.glass-card.skill-card` block with icon, label, heading, and pills.

"Currently working with" row is hardcoded below the grid using `getCurrentWorkingWith()`.

### Phase 8 — ExperienceComponent

Rebuild `experience.component.html`. Section ID `#experience`.

Inject `PortfolioService`, use `*ngFor` over `getJobs()` to render `<app-job-item>`.

Rebuild `job-item.component.*`:
- `@Input() job: Job`
- Renders `.timeline-item` with `.glass-card` inside
- `[class.past]="job.isPast"` on the `.timeline-item`
- Show `.pill--current` badge if `job.isCurrent`
- Stats rendered as `<app-stat-pill>` or inline `.pill--metric` spans
- Tech tags rendered as `<app-pill-tag>` or `.pill` spans

### Phase 9 — ProjectsComponent

Rebuild `projects.component.html`. Section ID `#projects`.

Inject `PortfolioService`. Render `getProjects()` with `*ngFor` over `<app-project-item>`.

Rebuild `project-item.component.*`:
- `@Input() project: Project`
- `[class.featured]="project.isFeatured"` on the `<article>`
- Featured card gets `project-art` placeholder div + two-column internal grid
- Non-featured cards are standard `.glass-card`
- Hardcode the placeholder card (`class="project-card placeholder glass-card"`) as the last sibling in the projects grid — it is not data-driven

### Phase 10 — EducationComponent (new)

Create `src/Components/credentials/education/education.component.*` or `src/Components/education/education.component.*`

Use `getEducation()`, render `*ngFor` with `<app-education-item>`.

Implement `education-item.component.*` (the stub exists):
- `@Input() edu: Education`
- Renders `.glass-card.edu-card` with institution badge, degree, duration, thesis quote, courses pills
- If `edu.honors`, renders `.honors-row` with `.pill--gold` badges

### Phase 11 — CredentialsComponent

The component is already wired up. Updates needed:
- Move cert data out of the component into `CERTIFICATES` const (Phase 3) and inject via `PortfolioService`
- Add education section above certs (use `EducationComponent` or inline the two-card grid)
- Update `certificate-item.component.html` CSS to match reference (`.cert-badge` with `.microsoft` / `.udemy` class, `.cert-arrow` hover reveal)
- Section ID: `#credentials`

### Phase 12 — ContactComponent

Rebuild `contact.component.html`. Section ID `#contact`.

Matches `<section class="contact" id="contact">` in reference:
- Centered layout, max-width 640px
- Email button copies to clipboard on click (use `navigator.clipboard.writeText(...)`)
- LinkedIn ghost button
- Social links row (GitHub, LeetCode)

### Phase 13 — Scroll reveal

Add an `IntersectionObserver` directive or service that matches the JS in the reference:

```typescript
// src/Directives/reveal.directive.ts
@Directive({ selector: '[appReveal]', standalone: true })
export class RevealDirective implements OnInit {
  // On init: add .reveal class, observe with IntersectionObserver
  // On intersect: add .visible class, unobserve
  // Stagger: check sibling index, multiply by 60ms delay
}
```

Apply `appReveal` to all cards and section headers that should animate in.

---

## CSS rules — do not deviate

All visual styling must use the CSS custom properties from the design tokens. Never hardcode a color value. The only exception is inline SVG fills that can't use variables.

**Never touch `styles.scss` font-family rule** — `body { font-family: var(--font-sans) }` replaces the current `monospace` override.

The `.glass-card` class does all card styling. Do not write per-component card styles — use the global class. Component SCSS files should only contain layout-specific overrides (grid columns, section padding, timeline positioning).

---

## Nav active state

The existing `appFragmentLinkActive` directive already handles adding an `active` class to nav links based on the fragment in view. Keep using it. The CSS for `.nav-links a.active` (dot indicator) is in the design tokens added to `styles.scss`.

---

## What NOT to do

- Do not use Angular Material components for section content — only for the sidenav/drawer that's already in AppComponent
- Do not install new npm packages — everything needed is already in the project or in standard browser APIs
- Do not use any routing animation or page transitions — the design is single-page scroll
- Do not create a separate route for `/experience` or `/credentials` — they are sections, not pages
- Do not add a `<router-outlet>` inside DashboardComponent — it renders sections directly
- Do not recreate the Material toolbar in the header — replace it with a plain `<header>` element styled with the design tokens

---

## Final check

When all phases are done, the rendered page at `localhost:4200/main` should be visually identical to opening `portfolio-design/project/Portfolio.standalone-src.html` directly in a browser. Diff them visually section by section before considering it done.
