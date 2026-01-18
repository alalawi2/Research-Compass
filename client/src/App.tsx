import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import AdminFeedback from "./pages/AdminFeedback";
import { FeedbackButton } from "./components/FeedbackButton";
import Projects from "./pages/Projects";
import SampleSizeCalculator from "./pages/SampleSizeCalculator";
import StudyWizard from "./pages/StudyWizard";
import ProposalWriter from "./pages/ProposalWriter";
import ResearchChat from "./pages/ResearchChat";
import TestSelector from "./pages/TestSelector";
import LiteratureSearch from "./pages/LiteratureSearch";
import BudgetCalculator from "./pages/BudgetCalculator";
import TimelinePlanner from "./pages/TimelinePlanner";
import ResearchWorkflow from "./pages/ResearchWorkflow";
import { AppShell } from "./components/AppShell";
import { CommandPalette } from "./components/CommandPalette";
import { useAuth } from "@/_core/hooks/useAuth";

// Wrapper for authenticated pages with AppShell
function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If authenticated, wrap in AppShell
  if (isAuthenticated) {
    return <AppShell>{children}</AppShell>;
  }

  // If not authenticated, render children directly (they handle their own auth UI)
  return <>{children}</>;
}

// Landing page wrapper (no shell)
function LandingLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();

  // If authenticated, use app shell for the dashboard
  if (isAuthenticated) {
    return <AppShell>{children}</AppShell>;
  }

  return <>{children}</>;
}

function Router() {
  return (
    <Switch>
      {/* Landing/Dashboard */}
      <Route path={"/"}>
        <LandingLayout>
          <Home />
        </LandingLayout>
      </Route>

      {/* Authenticated Pages */}
      <Route path="/projects">
        <AuthenticatedLayout>
          <Projects />
        </AuthenticatedLayout>
      </Route>

      <Route path="/research-workflow">
        <AuthenticatedLayout>
          <ResearchWorkflow />
        </AuthenticatedLayout>
      </Route>

      <Route path={"/admin/feedback"}>
        <AuthenticatedLayout>
          <AdminFeedback />
        </AuthenticatedLayout>
      </Route>

      <Route path="/tools/sample-size">
        <AuthenticatedLayout>
          <SampleSizeCalculator />
        </AuthenticatedLayout>
      </Route>

      <Route path="/tools/study-wizard">
        <AuthenticatedLayout>
          <StudyWizard />
        </AuthenticatedLayout>
      </Route>

      <Route path="/tools/proposal-writer">
        <AuthenticatedLayout>
          <ProposalWriter />
        </AuthenticatedLayout>
      </Route>

      <Route path="/tools/chat">
        <AuthenticatedLayout>
          <ResearchChat />
        </AuthenticatedLayout>
      </Route>

      <Route path="/tools/test-selector">
        <AuthenticatedLayout>
          <TestSelector />
        </AuthenticatedLayout>
      </Route>

      <Route path="/tools/literature">
        <AuthenticatedLayout>
          <LiteratureSearch />
        </AuthenticatedLayout>
      </Route>

      <Route path="/tools/budget">
        <AuthenticatedLayout>
          <BudgetCalculator />
        </AuthenticatedLayout>
      </Route>

      <Route path="/tools/timeline">
        <AuthenticatedLayout>
          <TimelinePlanner />
        </AuthenticatedLayout>
      </Route>

      {/* Not Found */}
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
          <FeedbackButton />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
