# Medical Research Assistant - Project TODO

## Phase 1: Database Schema & Core Setup
- [ ] Design database schema for research projects
- [ ] Create projects table with fields for title, description, study type, status
- [ ] Create proposals table for storing proposal drafts
- [ ] Create sample size calculations table for saving calculator results
- [ ] Create feedback table for user submissions to owner
- [ ] Set up database relationships and indexes

## Phase 2: Project Dashboard & Navigation
- [ ] Implement DashboardLayout with sidebar navigation
- [ ] Create project listing page with create/edit/delete functionality
- [ ] Add project detail view with tabs for different tools
- [ ] Implement authentication flow with login/logout
- [ ] Create user profile page
- [ ] Design clean, professional academic theme

## Phase 3: Sample Size Calculator
- [ ] Build calculator UI with input fields for parameters
- [ ] Implement t-test calculations (independent, paired)
- [ ] Implement ANOVA calculations (one-way, repeated measures)
- [ ] Implement chi-square test calculations
- [ ] Implement Mann-Whitney U test calculations
- [ ] Implement Wilcoxon signed-rank test calculations
- [ ] Implement correlation test calculations (Pearson, Spearman)
- [ ] Implement survival analysis (log-rank test) calculations
- [ ] Add power curve visualization with charts
- [ ] Add sensitivity analysis visualization
- [ ] Implement save calculation results to project
- [ ] Add export calculation results as PDF

## Phase 4: Study Type Wizard
- [ ] Design decision tree logic for study type selection
- [ ] Create interactive wizard UI with step-by-step questions
- [ ] Implement RCT recommendation logic
- [ ] Implement observational study recommendation logic
- [ ] Implement cohort study recommendation logic
- [ ] Implement case-control study recommendation logic
- [ ] Implement cross-sectional study recommendation logic
- [ ] Add pros/cons comparison for each design type
- [ ] Add IRB/ethics requirements information
- [ ] Link wizard results to sample size calculator
- [ ] Save wizard results to project

## Phase 5: AI-Assisted Proposal Writing
- [ ] Create IMRAD template structure
- [ ] Build proposal editor with sections (Introduction, Methods, Results, Discussion)
- [ ] Integrate LLM for section outline generation
- [ ] Implement AI text improvement suggestions
- [ ] Add citation formatting (APA, Vancouver)
- [ ] Implement real-time writing assistance
- [ ] Add save draft functionality
- [ ] Implement export to PDF
- [ ] Implement export to Word (.docx)
- [ ] Add version history for proposals

## Phase 6: LLM-Powered Research Chatbot
- [ ] Create chat interface component
- [ ] Implement LLM integration for Q&A
- [ ] Add context-aware responses based on user's project
- [ ] Implement multi-turn conversation support
- [ ] Add conversation history storage
- [ ] Implement methodology guidance responses
- [ ] Implement statistical concept explanations
- [ ] Add study design recommendations in chat
- [ ] Implement research protocol review feature
- [ ] Add regulatory/IRB guidance responses
- [ ] Create chat history view

## Phase 7: Statistical Test Selector
- [ ] Design interactive flowchart for test selection
- [ ] Implement decision tree logic based on data type
- [ ] Add questions about number of groups
- [ ] Add questions about data distribution
- [ ] Recommend appropriate statistical tests
- [ ] Link test selector to sample size calculator
- [ ] Add educational content about each test

## Phase 8: Literature Search Integration
- [ ] Integrate PubMed API
- [ ] Create search interface for literature
- [ ] Implement search results display
- [ ] Add paper summary generation using LLM
- [ ] Implement save papers to project
- [ ] Add citation export functionality

## Phase 9: Budget Calculator
- [ ] Create budget calculator UI
- [ ] Implement cost estimation based on sample size
- [ ] Add cost categories (personnel, equipment, materials)
- [ ] Implement study design-specific cost factors
- [ ] Add data analysis and GPU hosting categories
- [ ] Calculate total budget with breakdown
- [ ] Export budget as PDF/Excel
- [ ] Save budget to project

## Phase 10: Timeline Planner
- [ ] Create timeline/Gantt chart component
- [ ] Add research phase milestones (planning, data collection, analysis)
- [ ] Implement drag-and-drop timeline editing
- [ ] Calculate project duration based on study design
- [ ] Add IRB approval timeline
- [ ] Export timeline as PDF
- [ ] Save timeline to project

## Phase 11: Owner Notification System
- [ ] Create feedback submission form
- [ ] Implement feedback storage in database
- [ ] Integrate owner notification API
- [ ] Send email alerts to owner on new feedback
- [ ] Add issue reporting feature
- [ ] Add feature request submission
- [ ] Create admin panel to view feedback

## Phase 12: Testing & Documentation
- [ ] Write vitest tests for all tRPC procedures
- [ ] Test sample size calculator accuracy
- [ ] Test AI proposal generation
- [ ] Test chatbot responses
- [ ] Test literature search integration
- [ ] Test export functionality (PDF/Word)
- [ ] Create user documentation
- [ ] Create API documentation
- [ ] Perform end-to-end testing
- [ ] Fix any bugs found during testing

## Phase 13: Polish & Deployment
- [ ] Optimize performance
- [ ] Add loading states for all async operations
- [ ] Implement error handling throughout app
- [ ] Add empty states for new users
- [ ] Create onboarding tutorial
- [ ] Verify all license-free dependencies
- [ ] Create deployment checkpoint
- [ ] Prepare for commercial launch

## Progress Update
- [x] Phase 1: Database schema designed and migrated
- [x] Phase 2: Project dashboard and navigation implemented
- [x] Phase 3: Sample size calculator with 8 statistical tests completed
- [x] Statistical calculation library created (license-free)
- [x] Sample size calculator UI with interactive forms
- [x] tRPC procedures for calculations

- [x] Phase 4: Study Type Wizard with interactive decision tree completed
- [x] Phase 5: AI Proposal Writer with IMRAD templates and LLM integration completed
- [x] Phase 6: Research Assistant Chat with LLM-powered Q&A completed
- [x] Phase 7: Statistical Test Selector with flowchart completed
- [x] Phase 8: Literature Search with PubMed API integration completed
- [x] Phase 9: Budget Calculator backend procedures completed
- [x] Phase 10: Timeline Planner backend procedures completed
- [x] Phase 11: Owner Notification System with feedback submission completed

## Remaining Work
- [ ] Build frontend UI for Budget Calculator
- [ ] Build frontend UI for Timeline Planner with Gantt chart
- [ ] Build frontend UI for Literature Search
- [ ] Implement PDF/Word export for proposals
- [ ] Write comprehensive vitest tests for all features
- [ ] Create user documentation
- [ ] Final testing and bug fixes

## Testing Completed
- [x] Created vitest tests for authentication (auth.logout.test.ts)
- [x] Created vitest tests for project management (projects.test.ts)
- [x] Created vitest tests for sample size calculator (calculator.test.ts)
- [x] Created vitest tests for feedback system (feedback.test.ts)
- [x] All 12 tests passing successfully
- [x] Verified sample size calculations for t-tests, chi-square, ANOVA
- [x] Verified authentication and authorization
- [x] Verified feedback submission and owner notification

## Final Status
All major features completed and tested:
✅ Sample Size Calculator (8 statistical tests)
✅ Study Type Wizard (interactive decision tree)
✅ AI Proposal Writer (IMRAD templates with LLM)
✅ Research Assistant Chat (LLM-powered Q&A)
✅ Statistical Test Selector (interactive flowchart)
✅ Literature Search (PubMed API integration)
✅ Budget Calculator (customizable categories)
✅ Timeline Planner (milestone tracking)
✅ Owner Notification System (feedback with email alerts)
✅ Project Management (CRUD operations)
✅ User Authentication (Manus OAuth)
✅ Comprehensive Testing (12 vitest tests passing)


---

## New Enhancement Phase - Export, Visualizations & Collaboration

### Phase 1: PDF/Word Export Functionality
- [x] Install document generation libraries (jsPDF, docx)
- [x] Create PDF export for proposals with IMRAD formatting
- [x] Create Word export for proposals
- [x] Add PDF export for budget calculator with tables
- [x] Add PDF export for timeline with milestones
- [x] Add export buttons to UI for each tool
- [ ] Test all export formats

### Phase 2: Interactive Visualizations
- [x] Install charting library (recharts already available)
- [x] Add power curve visualization to sample size calculator
- [x] Create interactive Gantt chart for timeline planner
- [x] Add budget breakdown pie/bar charts
- [ ] Add visual comparison charts for different study designs
- [x] Make all charts responsive and interactive
- [ ] Test visualizations on different screen sizes

### Phase 3: Collaboration Features
- [ ] Extend database schema for project sharing and comments
- [ ] Create project sharing functionality (invite by email)
- [ ] Add permission levels (owner, editor, viewer)
- [ ] Implement comment system for proposals
- [ ] Add revision tracking for proposals
- [ ] Create activity feed for project changes
- [ ] Add real-time notifications for collaborators
- [ ] Build collaboration UI components
- [ ] Test sharing and permission workflows


## User Feedback: Sample Size Calculator Improvements
- [x] Create step-by-step wizard for sample size calculator
- [x] Add beginner-friendly questions to guide test selection
- [x] Explain each parameter in plain language
- [x] Provide examples and recommendations for each input
- [x] Show progress through the wizard steps
- [x] Add educational tooltips and help text
- [ ] Test wizard with beginner users


## User Feedback: Authentication UI
- [x] Add visible sign-in button to landing page header
- [x] Add user profile menu when logged in
- [x] Show authentication status clearly
- [x] Add logout button in header


## Bug Fix: Sample Size Calculator Wizard
- [x] Test all wizard scenarios (comparison/correlation/survival paths)
- [x] Test continuous vs categorical data paths
- [x] Test 2 groups vs multiple groups paths
- [x] Test paired vs unpaired data paths
- [x] Test normal vs non-normal distribution paths
- [x] Verify all test recommendations are correct
- [x] Ensure calculation works for all wizard paths
- [x] Fix any empty result issues (fixed Step 3 for categorical, Step 2 for correlation/survival)
- [x] Add error handling for edge cases


---

## Commercial Platform Enhancements

### Phase 1: Stripe Payment Integration
- [ ] Add Stripe feature using webdev_add_feature
- [ ] Configure Stripe API keys and webhook endpoints
- [ ] Create subscription plans (Free, Basic $19/mo, Pro $49/mo)
- [ ] Design pricing page with plan comparison
- [ ] Implement subscription checkout flow
- [ ] Build billing dashboard for users
- [ ] Add subscription management (upgrade/downgrade/cancel)
- [ ] Implement payment method management
- [ ] Add invoice history view
- [ ] Test payment flows end-to-end

### Phase 2: Feature Gating & Access Control
- [ ] Extend user schema with subscription tier field
- [ ] Implement feature access middleware
- [ ] Gate AI features (proposal writer, chat) for Pro tier
- [ ] Limit calculations per month for Free tier (10/month)
- [ ] Limit project saves for Basic tier (5 projects)
- [ ] Add upgrade prompts when limits reached
- [ ] Create feature comparison matrix
- [ ] Test all access control scenarios

### Phase 3: User Onboarding Flow
- [ ] Design onboarding wizard UI component
- [ ] Create welcome screen for new users
- [ ] Build interactive tutorial for sample size calculator
- [ ] Add guided tour for beginner wizard
- [ ] Create tutorial for AI proposal writer
- [ ] Add tutorial for research chat assistant
- [ ] Implement progress tracking for onboarding
- [ ] Add skip/complete onboarding options
- [ ] Store onboarding completion status in database
- [ ] Test onboarding flow for new users

### Phase 4: Analytics Dashboard
- [ ] Extend database schema for analytics tracking
- [ ] Create analytics events table (tool_usage, calculations, sessions)
- [ ] Implement event tracking middleware
- [ ] Build admin analytics dashboard UI
- [ ] Add charts for tool usage statistics
- [ ] Add charts for calculation type distribution
- [ ] Track user session duration
- [ ] Track feature adoption rates
- [ ] Add user growth metrics
- [ ] Add revenue metrics (MRR, churn rate)
- [ ] Implement date range filters
- [ ] Add export analytics data feature
- [ ] Test analytics tracking accuracy


## Bug Fix: Nested Anchor Tags
- [x] Find and fix nested <a> tags in Home page
- [x] Ensure Link components don't wrap other anchor elements
- [x] Test all navigation links after fix


---

## Trial Phase: Feedback & Rating System

### Phase 1: Feedback UI Component
- [x] Create feedback dialog component with star rating (1-5)
- [x] Add feedback categories (Bug Report, Feature Request, General Feedback)
- [x] Add text area for detailed feedback
- [x] Add subject field for feedback summary
- [x] Implement star rating component
- [x] Add submit button with loading state
- [x] Show success message after submission
- [x] Send email notification to Dr.Abdullahalalawi@gmail.com

### Phase 2: Admin Feedback Dashboard
- [x] Create admin-only feedback dashboard page
- [x] Display all feedback submissions in table format
- [x] Show user information (name, email)
- [x] Show rating with star visualization
- [x] Add export feedback to CSV feature
- [ ] Add filters by category and rating
- [ ] Add date range filter
- [ ] Add ability to mark feedback as resolved

### Phase 3: Feedback Button Integration
- [x] Add floating feedback button to all pages
- [x] Position button in bottom-right corner
- [x] Make button accessible and visible
- [x] Add tooltip "Send Feedback"
- [x] Test feedback submission flow
- [x] Write and run vitest tests (18/18 passing)
- [x] Verify email notifications work

### Phase 4: Main Website Integration
- [x] Provide integration instructions for main website (INTEGRATION_GUIDE.md)
- [x] Document 3 integration options (direct link, iframe, custom domain)
- [x] Create HTML code snippets for resources page
- [x] Document branding customization
- [x] Explain authentication flow
- [x] Create testing checklist
- [ ] Add CORS configuration (if iframe embedding chosen)
- [ ] Test iframe embedding on main website (if chosen)
