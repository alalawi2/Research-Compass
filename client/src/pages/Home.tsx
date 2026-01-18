import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { getLoginUrl } from "@/const";
import {
  Calculator,
  FileText,
  MessageSquare,
  DollarSign,
  Calendar,
  FlaskConical,
  Search,
  ArrowRight,
  Workflow,
  Compass,
  Sparkles,
  CheckCircle2,
  TrendingUp,
  Users,
  Clock,
  Target,
  Zap,
  Shield,
  BarChart3,
  FolderOpen,
  Plus,
} from "lucide-react";
import { Link } from "wouter";
import { Loader2 } from "lucide-react";
import { PageTransition, FadeIn, StaggerContainer } from "@/components/PageTransition";
import { PageLoader } from "@/components/ui/loading";

// Dashboard for authenticated users
function Dashboard() {
  const { user } = useAuth();

  const quickActions = [
    { icon: Plus, label: "New Project", href: "/projects?new=true", color: "bg-primary" },
    { icon: Workflow, label: "Start Workflow", href: "/research-workflow", color: "bg-teal-500" },
    { icon: Calculator, label: "Sample Size", href: "/tools/sample-size", color: "bg-purple-500" },
    { icon: MessageSquare, label: "AI Chat", href: "/tools/chat", color: "bg-amber-500" },
  ];

  const recentTools = [
    { icon: Calculator, label: "Sample Size Calculator", href: "/tools/sample-size", description: "Calculate required sample sizes" },
    { icon: FlaskConical, label: "Study Wizard", href: "/tools/study-wizard", description: "Choose study design" },
    { icon: FileText, label: "Proposal Writer", href: "/tools/proposal-writer", description: "AI-assisted writing" },
    { icon: Search, label: "Literature Search", href: "/tools/literature", description: "Search PubMed" },
    { icon: DollarSign, label: "Budget Calculator", href: "/tools/budget", description: "Estimate costs" },
    { icon: Calendar, label: "Timeline Planner", href: "/tools/timeline", description: "Plan milestones" },
  ];

  // Get greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <PageTransition>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Welcome Header */}
        <FadeIn>
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-1">
              {getGreeting()}, {user?.name?.split(" ")[0] || "Researcher"}
            </h1>
            <p className="text-muted-foreground">
              Here's what's happening with your research today.
            </p>
          </div>
        </FadeIn>

      {/* Quick Actions */}
      <FadeIn delay={100}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {quickActions.map((action, index) => (
            <Link key={action.label} href={action.href}>
              <a
                className="block animate-in fade-in-0 slide-in-from-bottom-2 duration-300"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <Card className="card-hover cursor-pointer h-full">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg ${action.color} flex items-center justify-center`}>
                      <action.icon className="h-5 w-5 text-white" />
                    </div>
                    <span className="font-medium">{action.label}</span>
                  </CardContent>
                </Card>
              </a>
            </Link>
          ))}
        </div>
      </FadeIn>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Featured: Research Workflow */}
          <Card className="border-primary/50 bg-gradient-to-br from-primary/5 to-transparent">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
                    <Workflow className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <Badge variant="secondary" className="mb-1">
                      <Sparkles className="h-3 w-3 mr-1" />
                      Featured
                    </Badge>
                    <CardTitle>Research Workflow</CardTitle>
                  </div>
                </div>
                <Link href="/research-workflow">
                  <Button>
                    Start
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Guided 11-phase journey from research question to final proposal with AI assistance at every step.
              </p>
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-teal-500" />
                  <span>PICO Framework</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-teal-500" />
                  <span>Literature Synthesis</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-teal-500" />
                  <span>Auto-Generated Proposal</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Research Tools Grid */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Research Tools</h2>
              <Link href="/tools">
                <Button variant="ghost" size="sm">
                  View All
                  <ArrowRight className="ml-2 h-3 w-3" />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {recentTools.map((tool, index) => (
                <Link key={tool.label} href={tool.href}>
                  <a
                    className="block animate-in fade-in-0 zoom-in-95 duration-300"
                    style={{ animationDelay: `${index * 75}ms` }}
                  >
                    <Card className="card-hover cursor-pointer h-full">
                      <CardContent className="p-4">
                        <tool.icon className="h-8 w-8 text-primary mb-3" />
                        <h3 className="font-medium mb-1">{tool.label}</h3>
                        <p className="text-xs text-muted-foreground">{tool.description}</p>
                      </CardContent>
                    </Card>
                  </a>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Projects Summary */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">My Projects</CardTitle>
                <Link href="/projects">
                  <Button variant="ghost" size="sm">
                    <FolderOpen className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center py-6">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
                  <FolderOpen className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  No projects yet
                </p>
                <Link href="/projects?new=true">
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Project
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Tips & Help */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Getting Started</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-semibold text-primary">1</span>
                </div>
                <div>
                  <p className="text-sm font-medium">Create a project</p>
                  <p className="text-xs text-muted-foreground">Organize your research work</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-semibold text-primary">2</span>
                </div>
                <div>
                  <p className="text-sm font-medium">Start the workflow</p>
                  <p className="text-xs text-muted-foreground">Follow guided research phases</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-semibold text-primary">3</span>
                </div>
                <div>
                  <p className="text-sm font-medium">Generate proposal</p>
                  <p className="text-xs text-muted-foreground">AI writes your proposal</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Keyboard Shortcuts */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Keyboard Shortcuts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Command Palette</span>
                <kbd className="kbd">⌘K</kbd>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Toggle Theme</span>
                <kbd className="kbd">⌘D</kbd>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Go to Projects</span>
                <kbd className="kbd">⌘2</kbd>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      </div>
    </PageTransition>
  );
}

// Landing page for unauthenticated users
function LandingPage() {
  const features = [
    {
      icon: Workflow,
      title: "Guided Research Workflow",
      description: "11-phase journey from research question to final proposal with AI assistance at every step."
    },
    {
      icon: Calculator,
      title: "Statistical Tools",
      description: "Sample size calculators, power analysis, and statistical test selection wizards."
    },
    {
      icon: FileText,
      title: "AI Proposal Writer",
      description: "Generate and refine research proposals with IMRAD templates and AI suggestions."
    },
    {
      icon: Search,
      title: "Literature Search",
      description: "Search PubMed, synthesize findings, and build your evidence base."
    },
    {
      icon: DollarSign,
      title: "Budget & Timeline",
      description: "Plan your research budget and create detailed project timelines."
    },
    {
      icon: MessageSquare,
      title: "AI Research Assistant",
      description: "Ask questions about methodology, statistics, and study design."
    }
  ];

  const benefits = [
    { icon: Zap, title: "Save Time", description: "Reduce proposal writing time by 50%" },
    { icon: Target, title: "Stay Focused", description: "Guided workflow keeps you on track" },
    { icon: Shield, title: "Best Practices", description: "Built-in research methodology standards" },
    { icon: BarChart3, title: "Data-Driven", description: "Statistical tools at your fingertips" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/">
            <a className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Compass className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">ResearchCompass</span>
            </a>
          </Link>

          <Button asChild>
            <a href={getLoginUrl()}>Sign In</a>
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-teal-500/5" />
        <div className="container relative py-24 md:py-32">
          <div className="max-w-3xl mx-auto text-center">
            <Badge variant="secondary" className="mb-4">
              <Sparkles className="h-3 w-3 mr-1" />
              AI-Powered Research Platform
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
              Navigate Your
              <span className="gradient-text"> Research Journey</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              The complete platform for academic and clinical researchers to plan, design, and write research proposals with AI-powered assistance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="text-base">
                <a href={getLoginUrl()}>
                  Get Started Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-base">
                <Link href="/research-workflow">
                  See How It Works
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 border-y bg-muted/30">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <benefit.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-1">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Comprehensive tools designed specifically for researchers, from initial concept to final proposal.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <Card key={feature.title} className="card-hover">
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow Preview */}
      <section className="py-24 bg-muted/30">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              11-Phase Research Workflow
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Follow our proven methodology from research question to final proposal.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                "Research Question",
                "Exploratory Review",
                "Systematic Review",
                "Literature Synthesis",
                "Rationale",
                "Study Design",
                "Sample Size",
                "Statistical Plan",
                "Methods",
                "Timeline & Ethics",
                "Proposal Generation"
              ].map((phase, index) => (
                <div
                  key={phase}
                  className="flex items-center gap-3 p-4 rounded-lg bg-background border"
                >
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
                    {index + 1}
                  </div>
                  <span className="font-medium">{phase}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Start Your Research Journey?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join researchers worldwide using our platform to design better studies and write compelling proposals.
            </p>
            <Button size="lg" asChild className="text-base">
              <a href={getLoginUrl()}>
                Create Free Account
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
                <Compass className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-semibold">ResearchCompass</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Empowering researchers worldwide.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function Home() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <PageLoader message="Loading your research dashboard..." />;
  }

  // Show dashboard for authenticated users, landing page for others
  return isAuthenticated ? <Dashboard /> : <LandingPage />;
}
