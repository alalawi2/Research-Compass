# ClinicalCompass 🧭

> Your comprehensive research workflow assistant - from question to proposal

ClinicalCompass is an AI-powered platform designed for academic and clinical researchers to plan, design, and write research proposals with guided step-by-step assistance.

## ✨ Features

### 🎯 Research Workflow Wizard
- **11-Phase Guided Journey**: From research question formulation to final proposal generation
- **AI-Powered Assistance**: Interactive dialogue for research question refinement
- **Progress Tracking**: Visual progress indicators and phase completion status
- **Auto-Save**: Automatic persistence of workflow state

### 📚 Literature Tools
- **PubMed Integration**: Advanced search with abstract preview
- **Literature Synthesis**: Thematic analysis and evidence tables
- **Systematic Review**: PRISMA-compliant documentation
- **Knowledge Gap Identification**: Automated gap analysis

### 🔬 Research Design Tools
- **Sample Size Calculator**: Multiple statistical tests (t-test, ANOVA, chi-square, etc.)
- **Study Type Wizard**: Interactive decision tree for study design selection
- **Statistical Planning**: Comprehensive analysis plan builder

### 📝 AI Writing Tools
- **Research Assistant Chat**: Context-aware AI conversation for research questions
- **Proposal Generator**: Auto-compiled proposal from workflow data
- **Export Options**: Download as Markdown, ready for conversion to Word/PDF

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm/pnpm
- PostgreSQL (or use local storage mode)

### Installation

```bash
# Clone the repository
cd clinical-compass

# Install dependencies
npm install
# or
pnpm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Build the project
npm run build

# Start the server
npm run dev
```

### Access the Application

Open your browser and navigate to:
```
http://localhost:3001
```

## 📖 Documentation

- [Quick Start Guide](WORKFLOW_QUICK_START.md) - Get started with the Research Workflow
- [Implementation Guide](WORKFLOW_IMPLEMENTATION.md) - Technical implementation details
- [Deployment Guide](DEPLOYMENT_COMPLETE.md) - Production deployment instructions
- [Testing Report](TESTING_REPORT.md) - Testing and quality assurance

## 🏗️ Project Structure

```
clinical-compass/
├── client/              # Frontend React application
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Page components
│   │   └── lib/         # Utilities and helpers
├── server/              # Backend Node.js server
│   ├── _core/           # Core server logic
│   └── routers.ts       # API routes
├── shared/              # Shared TypeScript types
└── drizzle/             # Database schema and migrations
```

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **shadcn/ui** component library
- **React Router** for navigation

### Backend
- **Node.js** with Express
- **tRPC** for type-safe APIs
- **Drizzle ORM** for database
- **PostgreSQL** for data storage

### AI Integration
- OpenAI GPT-4 for research assistance
- PubMed E-utilities API for literature search

## 📊 Workflow Phases

1. **Research Question** - PICO/PECO framework formulation
2. **Exploratory Review** - Initial literature exploration
3. **Systematic Review** - Comprehensive literature search
4. **Literature Synthesis** - Thematic analysis and evidence tables
5. **Rationale** - Significance and novelty justification
6. **Study Design** - Methodology selection
7. **Sample Size** - Power analysis and calculation
8. **Statistical Plan** - Analysis strategy
9. **Methods** - Detailed procedures
10. **Timeline & Ethics** - Project planning and approvals
11. **Proposal Generation** - Auto-compiled final document

## 🔧 Configuration

### Environment Variables

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/clinicalcompass

# OpenAI (for AI features)
OPENAI_API_KEY=your_openai_api_key

# PubMed API
PUBMED_API_KEY=your_pubmed_api_key  # Optional but recommended

# Server
PORT=3001
NODE_ENV=development
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

Built with modern web technologies and AI to accelerate clinical research.

---

**ClinicalCompass** - Navigate your research journey with confidence 🧭
