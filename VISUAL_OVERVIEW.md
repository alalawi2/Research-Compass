# Research-Compass Visual Overview

## Application Summary

**ResearchCompass** is a full-stack AI-powered research workflow assistant that guides researchers from initial question formulation to final proposal generation.

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              RESEARCH-COMPASS                                    │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │                         FRONTEND (React + Vite)                          │    │
│  │                                                                          │    │
│  │   ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────┐        │    │
│  │   │   Home     │  │  Projects  │  │  Research  │  │   Tools    │        │    │
│  │   │   Page     │  │  Dashboard │  │  Workflow  │  │   Suite    │        │    │
│  │   └────────────┘  └────────────┘  └────────────┘  └────────────┘        │    │
│  │                                                                          │    │
│  │   ┌──────────────────────────────────────────────────────────────────┐  │    │
│  │   │                    UI Components (shadcn/ui)                      │  │    │
│  │   │  Cards │ Forms │ Dialogs │ Charts │ Tables │ Navigation │ etc.   │  │    │
│  │   └──────────────────────────────────────────────────────────────────┘  │    │
│  │                                                                          │    │
│  │   React Query (State)  │  tRPC Client  │  Framer Motion  │  Tailwind    │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│                                        │                                         │
│                                        │ tRPC (Type-Safe RPC)                    │
│                                        ▼                                         │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │                       BACKEND (Express + tRPC)                           │    │
│  │                                                                          │    │
│  │   ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐           │    │
│  │   │  Auth   │ │ Projects│ │Proposals│ │  Chat   │ │Literature│           │    │
│  │   │ Router  │ │ Router  │ │ Router  │ │ Router  │ │ Router  │           │    │
│  │   └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘           │    │
│  │                                                                          │    │
│  │   ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐           │    │
│  │   │ Budget  │ │Timeline │ │Feedback │ │Workflow │ │SampleSz │           │    │
│  │   │ Router  │ │ Router  │ │ Router  │ │ Router  │ │ Router  │           │    │
│  │   └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘           │    │
│  │                                                                          │    │
│  │     OpenAI (LLM)  │  PubMed API  │  AWS S3  │  OAuth  │  Drizzle ORM    │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│                                        │                                         │
│                                        ▼                                         │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │                           DATABASE (MySQL)                               │    │
│  │                                                                          │    │
│  │   users │ projects │ proposals │ chat_messages │ budgets │ timelines    │    │
│  │   feedback │ saved_papers │ sample_calculations │ collaborators         │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## Technology Stack

```
┌────────────────────────────────────────────────────────────────────────────────┐
│                              TECHNOLOGY STACK                                   │
├────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│   FRONTEND                      BACKEND                    DATABASE             │
│   ────────                      ───────                    ────────             │
│   ┌──────────────┐              ┌──────────────┐           ┌──────────────┐    │
│   │  React 18    │              │  Express     │           │    MySQL     │    │
│   │  TypeScript  │◄────────────►│  tRPC        │◄─────────►│  Drizzle ORM │    │
│   │  Vite        │   Type-Safe  │  Node.js     │           │              │    │
│   └──────────────┘     RPC      └──────────────┘           └──────────────┘    │
│                                                                                 │
│   STYLING                       AI/EXTERNAL                BUILD TOOLS         │
│   ───────                       ───────────                ───────────         │
│   ┌──────────────┐              ┌──────────────┐           ┌──────────────┐    │
│   │  Tailwind    │              │  OpenAI GPT  │           │  Vite        │    │
│   │  shadcn/ui   │              │  PubMed API  │           │  ESBuild     │    │
│   │  Radix UI    │              │  AWS S3      │           │  TypeScript  │    │
│   └──────────────┘              └──────────────┘           └──────────────┘    │
│                                                                                 │
└────────────────────────────────────────────────────────────────────────────────┘
```

---

## Research Workflow (11 Phases)

```
┌────────────────────────────────────────────────────────────────────────────────┐
│                        RESEARCH WORKFLOW JOURNEY                                │
├────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│   Phase 1                Phase 2                Phase 3                         │
│   ┌──────────────┐       ┌──────────────┐       ┌──────────────┐               │
│   │   Research   │──────►│  Exploratory │──────►│  Systematic  │               │
│   │   Question   │       │    Review    │       │    Review    │               │
│   │  (PICO/PECO) │       │              │       │              │               │
│   └──────────────┘       └──────────────┘       └──────────────┘               │
│          │                                              │                       │
│          │                                              ▼                       │
│          │               Phase 5                Phase 4                         │
│          │               ┌──────────────┐       ┌──────────────┐               │
│          │               │   Rationale  │◄──────│  Literature  │               │
│          │               │  Significance│       │  Synthesis   │               │
│          │               │   & Novelty  │       │              │               │
│          │               └──────────────┘       └──────────────┘               │
│          │                      │                                               │
│          ▼                      ▼                                               │
│   Phase 6                Phase 7                Phase 8                         │
│   ┌──────────────┐       ┌──────────────┐       ┌──────────────┐               │
│   │    Study     │──────►│  Sample Size │──────►│ Statistical  │               │
│   │    Design    │       │ Calculation  │       │    Plan      │               │
│   │              │       │              │       │              │               │
│   └──────────────┘       └──────────────┘       └──────────────┘               │
│                                                        │                        │
│                                                        ▼                        │
│   Phase 11               Phase 10               Phase 9                         │
│   ┌──────────────┐       ┌──────────────┐       ┌──────────────┐               │
│   │   Proposal   │◄──────│   Timeline   │◄──────│   Methods    │               │
│   │  Generation  │       │   & Ethics   │       │              │               │
│   │   (IMRAD)    │       │              │       │              │               │
│   └──────────────┘       └──────────────┘       └──────────────┘               │
│          │                                                                      │
│          ▼                                                                      │
│   ┌──────────────────────────────────────────────────────────────────────┐     │
│   │                    FINAL RESEARCH PROPOSAL                            │     │
│   │   Introduction │ Methods │ Results │ Analysis │ Discussion │ Refs    │     │
│   └──────────────────────────────────────────────────────────────────────┘     │
│                                                                                 │
└────────────────────────────────────────────────────────────────────────────────┘
```

---

## Feature Map

```
┌────────────────────────────────────────────────────────────────────────────────┐
│                              FEATURE MAP                                        │
├────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│   ┌────────────────────────────────────────────────────────────────────────┐   │
│   │                              HOME PAGE                                  │   │
│   │   Landing page with feature overview and quick access to all tools     │   │
│   └────────────────────────────────────────────────────────────────────────┘   │
│                                      │                                          │
│            ┌─────────────────────────┼─────────────────────────┐               │
│            ▼                         ▼                         ▼               │
│   ┌────────────────┐        ┌────────────────┐        ┌────────────────┐       │
│   │    PROJECTS    │        │   WORKFLOW     │        │   TOOL SUITE   │       │
│   │   Management   │        │   (11 Phases)  │        │                │       │
│   └────────────────┘        └────────────────┘        └────────────────┘       │
│                                                               │                 │
│   ┌───────────────────────────────────────────────────────────┘                │
│   │                                                                             │
│   ▼                                                                             │
│   RESEARCH TOOLS                                                                │
│   ─────────────────────────────────────────────────────────────────────        │
│                                                                                 │
│   ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│   │  Sample Size │  │    Study     │  │  Proposal    │  │   Research   │       │
│   │  Calculator  │  │    Wizard    │  │   Writer     │  │     Chat     │       │
│   │              │  │              │  │              │  │              │       │
│   │ ○ 9 stat     │  │ ○ Decision   │  │ ○ IMRAD      │  │ ○ AI-powered │       │
│   │   tests      │  │   tree for   │  │   template   │  │   research   │       │
│   │ ○ Power      │  │   study      │  │ ○ AI         │  │   assistant  │       │
│   │   curves     │  │   design     │  │   refinement │  │ ○ Context    │       │
│   │ ○ Multiple   │  │ ○ Guidance   │  │ ○ Export     │  │   aware      │       │
│   │   designs    │  │   system     │  │   (PDF/Word) │  │              │       │
│   └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘       │
│                                                                                 │
│   ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│   │  Statistical │  │  Literature  │  │    Budget    │  │   Timeline   │       │
│   │    Test      │  │   Search     │  │  Calculator  │  │   Planner    │       │
│   │   Selector   │  │              │  │              │  │              │       │
│   │              │  │              │  │              │  │              │       │
│   │ ○ Flowchart  │  │ ○ PubMed     │  │ ○ Cost       │  │ ○ Gantt      │       │
│   │   decision   │  │   search     │  │   estimation │  │   chart      │       │
│   │   tree       │  │ ○ Abstract   │  │ ○ Categories │  │ ○ Milestones │       │
│   │ ○ Test       │  │   preview    │  │ ○ Currency   │  │ ○ Phase      │       │
│   │   guidance   │  │ ○ Save       │  │   support    │  │   tracking   │       │
│   │              │  │   papers     │  │              │  │              │       │
│   └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘       │
│                                                                                 │
│   ADMIN FEATURES                                                                │
│   ─────────────────────────────────────────────────────────────────────        │
│                                                                                 │
│   ┌──────────────┐  ┌──────────────┐                                           │
│   │   Feedback   │  │    User      │                                           │
│   │  Dashboard   │  │  Management  │                                           │
│   │              │  │              │                                           │
│   │ ○ View all   │  │ ○ Role-based │                                           │
│   │   feedback   │  │   access     │                                           │
│   │ ○ Respond    │  │ ○ OAuth      │                                           │
│   │   to users   │  │   login      │                                           │
│   └──────────────┘  └──────────────┘                                           │
│                                                                                 │
└────────────────────────────────────────────────────────────────────────────────┘
```

---

## Page Navigation Map

```
┌────────────────────────────────────────────────────────────────────────────────┐
│                            ROUTING STRUCTURE                                    │
├────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│   /                                                                             │
│   └── Home Page                                                                 │
│                                                                                 │
│   /projects                                                                     │
│   └── Projects Dashboard                                                        │
│                                                                                 │
│   /research-workflow                                                            │
│   └── 11-Phase Research Workflow                                                │
│                                                                                 │
│   /admin                                                                        │
│   └── /feedback ──► Admin Feedback Dashboard                                   │
│                                                                                 │
│   /tools                                                                        │
│   ├── /sample-size ───────► Sample Size Calculator                              │
│   ├── /study-wizard ──────► Study Type Wizard                                   │
│   ├── /proposal-writer ───► AI Proposal Writer                                  │
│   ├── /chat ──────────────► Research Assistant Chat                             │
│   ├── /test-selector ─────► Statistical Test Selector                           │
│   ├── /literature ────────► Literature Search (PubMed)                          │
│   ├── /budget ────────────► Budget Calculator                                   │
│   └── /timeline ──────────► Timeline Planner                                    │
│                                                                                 │
│   /404                                                                          │
│   └── Not Found Page                                                            │
│                                                                                 │
└────────────────────────────────────────────────────────────────────────────────┘
```

---

## Database Schema Overview

```
┌────────────────────────────────────────────────────────────────────────────────┐
│                           DATABASE SCHEMA                                       │
├────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│   ┌─────────────────────────────────────────────────────────────────────────┐  │
│   │                              USERS                                       │  │
│   │   id │ openId │ name │ email │ role │ createdAt │ updatedAt             │  │
│   └───────────────────────────────────┬─────────────────────────────────────┘  │
│                                       │                                         │
│            ┌──────────────────────────┼──────────────────────────┐             │
│            │                          │                          │             │
│            ▼                          ▼                          ▼             │
│   ┌────────────────┐        ┌────────────────┐        ┌────────────────┐       │
│   │    PROJECTS    │        │    FEEDBACK    │        │CHAT_CONVERS.   │       │
│   │                │        │                │        │                │       │
│   │ id, userId     │        │ id, userId     │        │ id, userId     │       │
│   │ title, desc    │        │ type, content  │        │ title          │       │
│   │ studyType      │        │ status         │        │ createdAt      │       │
│   │ status         │        │ response       │        │                │       │
│   └───────┬────────┘        └────────────────┘        └───────┬────────┘       │
│           │                                                    │                │
│           ├────────────────────────────────────────────────────┘                │
│           │                                                                     │
│   ┌───────┴───────────────────────────────────────────────────────────────┐    │
│   │                                                                        │    │
│   ▼               ▼               ▼               ▼               ▼        │    │
│   ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────────┐   │    │
│   │PROPOSALS│ │BUDGETS │ │TIMELINE│ │SAVED   │ │SAMPLE  │ │CHAT        │   │    │
│   │        │ │        │ │        │ │PAPERS  │ │SIZE    │ │MESSAGES    │   │    │
│   │IMRAD   │ │JSON    │ │JSON    │ │        │ │CALCS   │ │            │   │    │
│   │sections│ │categors│ │mileston│ │pubmed  │ │stats   │ │content     │   │    │
│   └────────┘ └────────┘ └────────┘ └────────┘ └────────┘ └────────────┘   │    │
│                                                                            │    │
│   ┌────────────────────────────────────────────────────────────────────┐  │    │
│   │                     PROJECT RELATIONSHIPS                           │  │    │
│   │                                                                     │  │    │
│   │   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                │  │    │
│   │   │COLLABORATORS│  │  COMMENTS   │  │  REVISIONS  │                │  │    │
│   │   │             │  │  (proposal) │  │  (proposal) │                │  │    │
│   │   │ userId      │  │  content    │  │  snapshot   │                │  │    │
│   │   │ permissions │  │  author     │  │  version    │                │  │    │
│   │   └─────────────┘  └─────────────┘  └─────────────┘                │  │    │
│   │                                                                     │  │    │
│   │   ┌─────────────────────────────────────────────────────────────┐  │  │    │
│   │   │                 PROJECT_ACTIVITIES (Audit Log)               │  │  │    │
│   │   │   id │ projectId │ userId │ action │ details │ timestamp    │  │  │    │
│   │   └─────────────────────────────────────────────────────────────┘  │  │    │
│   └────────────────────────────────────────────────────────────────────┘  │    │
│                                                                            │    │
└────────────────────────────────────────────────────────────────────────────┘    │
```

---

## Component Hierarchy

```
┌────────────────────────────────────────────────────────────────────────────────┐
│                          COMPONENT ARCHITECTURE                                 │
├────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│   App.tsx                                                                       │
│   ├── ErrorBoundary                                                             │
│   ├── ThemeProvider                                                             │
│   ├── TooltipProvider                                                           │
│   └── Router                                                                    │
│       │                                                                         │
│       ├── Home                                                                  │
│       │   ├── Hero Section                                                      │
│       │   ├── Feature Cards                                                     │
│       │   └── CTA Buttons                                                       │
│       │                                                                         │
│       ├── ResearchWorkflow                                                      │
│       │   ├── Phase Progress Bar                                                │
│       │   ├── ResearchQuestionPhase ────┐                                       │
│       │   ├── ExploratoryReviewPhase    │                                       │
│       │   ├── LiteratureSynthesisPhase  ├── Workflow Phases                     │
│       │   ├── RationalePhase            │                                       │
│       │   └── ProposalGeneratorPhase ───┘                                       │
│       │                                                                         │
│       ├── SampleSizeCalculator                                                  │
│       │   ├── SampleSizeWizard                                                  │
│       │   │   ├── Test Type Selector                                            │
│       │   │   ├── Parameters Form                                               │
│       │   │   └── Results Display                                               │
│       │   └── PowerCurveChart                                                   │
│       │                                                                         │
│       ├── Projects                                                              │
│       │   ├── Project Cards                                                     │
│       │   ├── Create Dialog                                                     │
│       │   └── Project Actions                                                   │
│       │                                                                         │
│       ├── BudgetCalculator                                                      │
│       │   ├── Category Forms                                                    │
│       │   └── BudgetChart                                                       │
│       │                                                                         │
│       ├── TimelinePlanner                                                       │
│       │   ├── Milestone Editor                                                  │
│       │   └── GanttChart                                                        │
│       │                                                                         │
│       └── [Other Tool Pages]                                                    │
│                                                                                 │
│   ┌────────────────────────────────────────────────────────────────────────┐   │
│   │                         GLOBAL COMPONENTS                               │   │
│   │   FeedbackButton │ FeedbackDialog │ Toaster │ DashboardLayout          │   │
│   └────────────────────────────────────────────────────────────────────────┘   │
│                                                                                 │
│   ┌────────────────────────────────────────────────────────────────────────┐   │
│   │                        UI COMPONENT LIBRARY                             │   │
│   │                           (50+ components)                              │   │
│   │                                                                         │   │
│   │   Layout          Forms             Feedback         Navigation         │   │
│   │   ────────        ─────             ────────         ──────────         │   │
│   │   Card            Input             Alert            Breadcrumb         │   │
│   │   Separator       Label             Toast            Menubar            │   │
│   │   ScrollArea      Checkbox          Progress         Sidebar            │   │
│   │   Resizable       Select            Skeleton         Tabs               │   │
│   │   AspectRatio     Textarea          Badge                               │   │
│   │                   RadioGroup                                            │   │
│   │                   Switch                                                │   │
│   │                   Slider                                                │   │
│   │                                                                         │   │
│   │   Overlays        Data Display      Advanced                            │   │
│   │   ────────        ────────────      ────────                            │   │
│   │   Dialog          Avatar            Carousel                            │   │
│   │   AlertDialog     Table             Calendar                            │   │
│   │   Drawer          Chart             Command                             │   │
│   │   Popover         Collapsible       ContextMenu                         │   │
│   │   Tooltip         Accordion         DropdownMenu                        │   │
│   │   Sheet           HoverCard                                             │   │
│   └────────────────────────────────────────────────────────────────────────┘   │
│                                                                                 │
└────────────────────────────────────────────────────────────────────────────────┘
```

---

## Data Flow

```
┌────────────────────────────────────────────────────────────────────────────────┐
│                              DATA FLOW                                          │
├────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│   USER INTERACTION                                                              │
│         │                                                                       │
│         ▼                                                                       │
│   ┌──────────────┐                                                              │
│   │    React     │  ◄──── Local State (useState, useReducer)                    │
│   │  Component   │  ◄──── Theme Context (dark/light mode)                       │
│   └──────────────┘  ◄──── localStorage (workflow auto-save)                     │
│         │                                                                       │
│         │ trpc.router.procedure.useQuery()                                      │
│         │ trpc.router.procedure.useMutation()                                   │
│         ▼                                                                       │
│   ┌──────────────┐                                                              │
│   │ React Query  │  ◄──── Caching, Optimistic Updates                           │
│   │  (TanStack)  │  ◄──── Background Refetching                                 │
│   └──────────────┘                                                              │
│         │                                                                       │
│         │ HTTP POST /api/trpc/*                                                 │
│         ▼                                                                       │
│   ┌──────────────┐                                                              │
│   │    tRPC      │  ◄──── Type-safe RPC                                         │
│   │   Client     │  ◄──── Automatic Serialization                               │
│   └──────────────┘                                                              │
│         │                                                                       │
│         │ ============= NETWORK BOUNDARY =============                          │
│         ▼                                                                       │
│   ┌──────────────┐                                                              │
│   │    tRPC      │  ◄──── Middleware (auth, logging)                            │
│   │   Router     │  ◄──── Procedure Handlers                                    │
│   └──────────────┘                                                              │
│         │                                                                       │
│         │ Context: { user, req, res }                                           │
│         ▼                                                                       │
│   ┌──────────────────────────────────────────────────────────────────────┐     │
│   │                        BUSINESS LOGIC                                 │     │
│   │                                                                       │     │
│   │   ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐             │     │
│   │   │   db.ts  │  │  llm.ts  │  │ PubMed   │  │   S3     │             │     │
│   │   │ Database │  │  OpenAI  │  │   API    │  │ Storage  │             │     │
│   │   └──────────┘  └──────────┘  └──────────┘  └──────────┘             │     │
│   └──────────────────────────────────────────────────────────────────────┘     │
│         │                                                                       │
│         │ Drizzle ORM                                                           │
│         ▼                                                                       │
│   ┌──────────────┐                                                              │
│   │    MySQL     │                                                              │
│   │   Database   │                                                              │
│   └──────────────┘                                                              │
│                                                                                 │
└────────────────────────────────────────────────────────────────────────────────┘
```

---

## Statistical Tests Available

```
┌────────────────────────────────────────────────────────────────────────────────┐
│                     SAMPLE SIZE CALCULATOR TESTS                                │
├────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│   ┌─────────────────────────────────────────────────────────────────────────┐  │
│   │                         PARAMETRIC TESTS                                 │  │
│   │                                                                          │  │
│   │   ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐         │  │
│   │   │  Independent    │  │     Paired      │  │     ANOVA       │         │  │
│   │   │    T-Test       │  │     T-Test      │  │                 │         │  │
│   │   │                 │  │                 │  │                 │         │  │
│   │   │ Compare means   │  │ Pre-post design │  │ 3+ group means  │         │  │
│   │   │ of 2 groups     │  │ same subjects   │  │ comparison      │         │  │
│   │   └─────────────────┘  └─────────────────┘  └─────────────────┘         │  │
│   └─────────────────────────────────────────────────────────────────────────┘  │
│                                                                                 │
│   ┌─────────────────────────────────────────────────────────────────────────┐  │
│   │                       NON-PARAMETRIC TESTS                               │  │
│   │                                                                          │  │
│   │   ┌─────────────────┐  ┌─────────────────┐                               │  │
│   │   │  Mann-Whitney   │  │    Wilcoxon     │                               │  │
│   │   │       U         │  │  Signed-Rank    │                               │  │
│   │   │                 │  │                 │                               │  │
│   │   │ Non-normal 2    │  │ Non-normal      │                               │  │
│   │   │ group compare   │  │ paired data     │                               │  │
│   │   └─────────────────┘  └─────────────────┘                               │  │
│   └─────────────────────────────────────────────────────────────────────────┘  │
│                                                                                 │
│   ┌─────────────────────────────────────────────────────────────────────────┐  │
│   │                     CATEGORICAL & OTHER TESTS                            │  │
│   │                                                                          │  │
│   │   ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐         │  │
│   │   │   Chi-Square    │  │   Correlation   │  │    Log-Rank     │         │  │
│   │   │                 │  │                 │  │                 │         │  │
│   │   │ Categorical     │  │ Relationship    │  │ Survival        │         │  │
│   │   │ variables       │  │ strength        │  │ analysis        │         │  │
│   │   └─────────────────┘  └─────────────────┘  └─────────────────┘         │  │
│   │                                                                          │  │
│   │   ┌─────────────────┐                                                    │  │
│   │   │Cross-Sectional  │                                                    │  │
│   │   │                 │                                                    │  │
│   │   │ Prevalence      │                                                    │  │
│   │   │ studies         │                                                    │  │
│   │   └─────────────────┘                                                    │  │
│   └─────────────────────────────────────────────────────────────────────────┘  │
│                                                                                 │
└────────────────────────────────────────────────────────────────────────────────┘
```

---

## Quick Reference

| Feature | Route | Description |
|---------|-------|-------------|
| Home | `/` | Landing page with overview |
| Projects | `/projects` | Manage research projects |
| Research Workflow | `/research-workflow` | 11-phase guided journey |
| Sample Size | `/tools/sample-size` | Calculate sample sizes |
| Study Wizard | `/tools/study-wizard` | Choose study design |
| Proposal Writer | `/tools/proposal-writer` | AI-assisted writing |
| Research Chat | `/tools/chat` | AI research assistant |
| Test Selector | `/tools/test-selector` | Choose statistical test |
| Literature | `/tools/literature` | Search PubMed |
| Budget | `/tools/budget` | Calculate costs |
| Timeline | `/tools/timeline` | Plan milestones |
| Admin Feedback | `/admin/feedback` | View user feedback |

---

*Generated for Research-Compass application inspection*
