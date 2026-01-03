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

function Router() {
  return (
    <Switch>
         <Route path={"/"} component={Home} />
      <Route path={"/admin/feedback"} component={AdminFeedback} />
      <Route path={"/404"} component={NotFound} />
      <Route path="/tools/sample-size" component={SampleSizeCalculator} />
      <Route path="/tools/study-wizard" component={StudyWizard} />
      <Route path="/tools/proposal-writer" component={ProposalWriter} />
      <Route path="/tools/chat" component={ResearchChat} />
      <Route path="/tools/test-selector" component={TestSelector} />
      <Route path="/tools/literature" component={LiteratureSearch} />
      <Route path="/tools/budget" component={BudgetCalculator} />
      <Route path="/tools/timeline" component={TimelinePlanner} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
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
