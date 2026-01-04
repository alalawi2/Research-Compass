import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getLoginUrl } from "@/const";
import { 
  Calculator, 
  FileText, 
  MessageSquare, 
  BookOpen, 
  DollarSign, 
  Calendar,
  FlaskConical,
  Search,
  ArrowRight,
  Workflow
} from "lucide-react";
import { Link } from "wouter";
import { Loader2 } from "lucide-react";

export default function Home() {
  const { user, isAuthenticated, loading, logout } = useAuth();

  const features = [
    {
      icon: Workflow,
      title: "Research Workflow",
      description: "NEW! Guided end-to-end journey from research question to final proposal with integrated literature synthesis and auto-generated sections.",
      href: "/research-workflow",
      featured: true
    },
    {
      icon: Calculator,
      title: "Sample Size Calculator",
      description: "Calculate required sample sizes for multiple statistical tests including t-tests, ANOVA, chi-square, and more with power curve visualizations.",
      href: "/tools/sample-size"
    },
    {
      icon: FlaskConical,
      title: "Study Type Wizard",
      description: "Interactive decision tree to help you select the appropriate study design for your research question.",
      href: "/tools/study-wizard"
    },
    {
      icon: FileText,
      title: "AI Proposal Writer",
      description: "Generate and refine research proposals with AI assistance, IMRAD templates, and export to PDF/Word.",
      href: "/tools/proposal-writer"
    },
    {
      icon: MessageSquare,
      title: "Research Assistant Chat",
      description: "Ask questions about methodology, statistics, and study design. Get context-aware guidance from our AI assistant.",
      href: "/tools/chat"
    },
    {
      icon: FlaskConical,
      title: "Statistical Test Selector",
      description: "Interactive flowchart to help you choose the right statistical test based on your data type and research question.",
      href: "/tools/test-selector"
    },
    {
      icon: Search,
      title: "Literature Search",
      description: "Search PubMed for relevant research papers and save them to your projects with AI-generated summaries.",
      href: "/tools/literature"
    },
    {
      icon: DollarSign,
      title: "Budget Calculator",
      description: "Estimate research costs based on sample size, study design, and resource requirements.",
      href: "/tools/budget"
    },
    {
      icon: Calendar,
      title: "Timeline Planner",
      description: "Create and visualize your research timeline with milestones for each phase of your study.",
      href: "/tools/timeline"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/">
            <a className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <h2 className="text-xl font-bold">ClinicalCompass</h2>
            </a>
          </Link>
          
          <div className="flex items-center gap-4">
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : isAuthenticated ? (
              <>
                <span className="text-sm text-muted-foreground hidden sm:inline">Welcome, {user?.name || 'User'}</span>
                <Link href="/projects">
                  <Button variant="ghost">My Projects</Button>
                </Link>
                <Button variant="outline" onClick={() => logout()}>Sign Out</Button>
              </>
            ) : (
              <Button asChild>
                <a href={getLoginUrl()}>Sign In</a>
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-gradient-to-b from-primary/5 to-background">
        <div className="container py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              ClinicalCompass
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Your comprehensive platform for academic and clinical researchers to plan, design, and write research proposals with AI-powered assistance.
            </p>
            {isAuthenticated ? (
              <div className="flex gap-4 justify-center">
                <Link href="/research-workflow">
                  <Button size="lg">
                    Start Workflow
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/projects">
                  <Button size="lg" variant="outline">
                    View Projects
                  </Button>
                </Link>
              </div>
            ) : (
              <Button size="lg" asChild>
                <a href={getLoginUrl()}>
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="container py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Comprehensive Research Tools</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Everything you need to design, plan, and execute your research project from start to finish.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className={`hover:shadow-lg transition-shadow ${feature.featured ? 'border-primary border-2' : ''}`}>
                <CardHeader>
                  <Icon className="h-10 w-10 text-primary mb-2" />
                  {feature.featured && (
                    <span className="text-xs font-semibold text-primary mb-1">★ FEATURED</span>
                  )}
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4">
                    {feature.description}
                  </CardDescription>
                  {isAuthenticated ? (
                    <Button variant="ghost" size="sm" className="w-full" asChild>
                      <Link href={feature.href}>
                        Open Tool
                        <ArrowRight className="ml-2 h-3 w-3" />
                      </Link>
                    </Button>
                  ) : (
                    <Button variant="ghost" size="sm" className="w-full" asChild>
                      <a href={getLoginUrl()}>
                        Login to Access
                      </a>
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary/5 py-16">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Start Your Research Journey?
            </h2>
            <p className="text-muted-foreground mb-8">
              Join researchers worldwide using our platform to design better studies and write compelling proposals.
            </p>
            {!isAuthenticated && (
              <Button size="lg" asChild>
                <a href={getLoginUrl()}>
                  Create Free Account
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
