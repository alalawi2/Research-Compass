import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import ResearchQuestionPhase from "@/components/workflow/ResearchQuestionPhase";
import ExploratoryReviewPhase from "@/components/workflow/ExploratoryReviewPhase";
import LiteratureSynthesisPhase from "@/components/workflow/LiteratureSynthesisPhase";
import RationalePhase from "@/components/workflow/RationalePhase";
import ProposalGeneratorPhase from "@/components/workflow/ProposalGeneratorPhase";
import type { ResearchWorkflowState, ResearchQuestion, ExploratoryReview, LiteratureSynthesis, Rationale } from "@shared/workflow-types";
import { 
  CheckCircle2, 
  Circle, 
  Lock,
  Lightbulb,
  BookOpen,
  Search,
  FileText,
  Target,
  Microscope,
  Calculator,
  BarChart3,
  ClipboardList,
  Calendar,
  FileCheck
} from "lucide-react";

// Workflow phases - comprehensive research journey
const WORKFLOW_PHASES = [
  { id: 1, name: "Research Question", description: "Define your PICO/PECO question", icon: Lightbulb },
  { id: 2, name: "Exploratory Review", description: "Initial literature exploration", icon: BookOpen },
  { id: 3, name: "Systematic Review", description: "Structured literature search", icon: Search },
  { id: 4, name: "Literature Synthesis", description: "Analyze themes and evidence", icon: FileText },
  { id: 5, name: "Rationale", description: "Build research justification", icon: Target },
  { id: 6, name: "Study Design", description: "Choose methodology", icon: Microscope },
  { id: 7, name: "Sample Size", description: "Calculate required participants", icon: Calculator },
  { id: 8, name: "Statistical Plan", description: "Define analysis strategy", icon: BarChart3 },
  { id: 9, name: "Methods", description: "Detail procedures and protocols", icon: ClipboardList },
  { id: 10, name: "Timeline & Ethics", description: "Plan schedule and approvals", icon: Calendar },
  { id: 11, name: "Generate Proposal", description: "Auto-compile final document", icon: FileCheck }
];

export default function ResearchWorkflow() {
  const [currentPhase, setCurrentPhase] = useState(1);
  const [completedPhases, setCompletedPhases] = useState<Set<number>>(new Set());
  const [workflowData, setWorkflowData] = useState<ResearchWorkflowState>({
    currentPhase: 1,
    completedPhases: [],
  });

  // Auto-save to localStorage
  useEffect(() => {
    const saved = localStorage.getItem('researchWorkflow');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setWorkflowData(parsed);
        setCurrentPhase(parsed.currentPhase || 1);
        setCompletedPhases(new Set(parsed.completedPhases || []));
      } catch (e) {
        console.error('Failed to load saved workflow:', e);
      }
    }
  }, []);

  useEffect(() => {
    const dataToSave = {
      ...workflowData,
      currentPhase,
      completedPhases: Array.from(completedPhases),
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem('researchWorkflow', JSON.stringify(dataToSave));
  }, [workflowData, currentPhase, completedPhases]);

  const progressPercentage = (completedPhases.size / WORKFLOW_PHASES.length) * 100;

  const getPhaseStatus = (phaseId: number) => {
    if (completedPhases.has(phaseId)) return "completed";
    if (phaseId === currentPhase) return "current";
    if (phaseId === currentPhase + 1) return "next";
    if (phaseId < currentPhase) return "available";
    return "locked";
  };

  const handlePhaseComplete = () => {
    setCompletedPhases(prev => {
      const newSet = new Set(prev);
      newSet.add(currentPhase);
      return newSet;
    });
    if (currentPhase < WORKFLOW_PHASES.length) {
      setCurrentPhase(currentPhase + 1);
    }
  };

  const handleNavigateToPhase = (phaseId: number) => {
    const status = getPhaseStatus(phaseId);
    if (status !== "locked") {
      setCurrentPhase(phaseId);
    }
  };

  const handleSave = () => {
    // Save workflow data (already auto-saving to localStorage)
    console.log('Workflow saved:', workflowData);
  };

  const renderPhaseContent = () => {
    const phase = WORKFLOW_PHASES[currentPhase - 1];
    
    // Phase 1: Research Question with interactive dialogue
    if (currentPhase === 1) {
      return (
        <ResearchQuestionPhase
          data={workflowData.researchQuestion}
          onSave={(data: ResearchQuestion) => {
            setWorkflowData(prev => ({ ...prev, researchQuestion: data }));
          }}
          onNext={handlePhaseComplete}
        />
      );
    }
    
    return (
      <Card className="p-8">
        <div className="flex items-center gap-3 mb-6">
          <phase.icon className="h-8 w-8 text-primary" />
          <div>
            <h2 className="text-2xl font-bold">{phase.name}</h2>
            <p className="text-muted-foreground">{phase.description}</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Phase-specific content will be implemented here */}
          {currentPhase === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Let's define your research question</h3>
              <p className="text-muted-foreground">
                I'll guide you through formulating a clear PICO/PECO question that will drive your entire research project.
              </p>
              <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
                  Coming soon: AI-guided research question dialogue
                </p>
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  This phase will include interactive conversation to help you define Population, Intervention/Exposure, Comparison, and Outcome.
                </p>
              </div>
            </div>
          )}

          {currentPhase === 2 && (
            <ExploratoryReviewPhase
              data={workflowData.exploratoryReview}
              researchQuestion={workflowData.researchQuestion?.picoSummary}
              onSave={(data: ExploratoryReview) => {
                setWorkflowData(prev => ({ ...prev, exploratoryReview: data }));
              }}
              onNext={handlePhaseComplete}
            />
          )}

          {currentPhase === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Systematic Literature Review</h3>
              <p className="text-muted-foreground">
                Conduct a structured search with clear inclusion/exclusion criteria.
              </p>
              <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                  Enhanced PubMed search integration coming soon
                </p>
              </div>
            </div>
          )}

          {currentPhase === 4 && (
            <LiteratureSynthesisPhase
              data={workflowData.literatureSynthesis}
              systematicReviewData={workflowData.systematicReview}
              onSave={(data: LiteratureSynthesis) => {
                setWorkflowData(prev => ({ ...prev, literatureSynthesis: data }));
              }}
              onNext={handlePhaseComplete}
            />
          )}

          {currentPhase === 5 && (
            <RationalePhase
              data={workflowData.rationale}
              synthesisData={workflowData.literatureSynthesis}
              onSave={(data: Rationale) => {
                setWorkflowData(prev => ({ ...prev, rationale: data }));
              }}
              onNext={handlePhaseComplete}
            />
          )}

          {currentPhase === 6 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Study Design Selection</h3>
              <p className="text-muted-foreground">
                Choose the most appropriate methodology for your research question.
              </p>
              <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                  Integration with Study Design Wizard coming soon
                </p>
              </div>
            </div>
          )}

          {currentPhase === 7 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Sample Size Calculation</h3>
              <p className="text-muted-foreground">
                Determine how many participants you need for adequate statistical power.
              </p>
              <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg border border-green-200 dark:border-green-800">
                <p className="text-sm font-medium text-green-900 dark:text-green-100">
                  ✓ Sample Size Calculator integration ready
                </p>
              </div>
            </div>
          )}

          {currentPhase === 8 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Statistical Analysis Plan</h3>
              <p className="text-muted-foreground">
                Define your primary and secondary analyses before collecting data.
              </p>
            </div>
          )}

          {currentPhase === 9 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Detailed Methods</h3>
              <p className="text-muted-foreground">
                Document procedures, data collection, and quality control measures.
              </p>
            </div>
          )}

          {currentPhase === 10 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Timeline & Ethics</h3>
              <p className="text-muted-foreground">
                Plan your project schedule and prepare ethics approval documents.
              </p>
            </div>
          )}

          {currentPhase === 11 && (
            <ProposalGeneratorPhase
              workflowData={workflowData}
              onSave={handleSave}
            />
          )}

          {/* Navigation buttons */}
          <div className="flex justify-between pt-6 border-t">
            <Button
              variant="outline"
              onClick={() => setCurrentPhase(Math.max(1, currentPhase - 1))}
              disabled={currentPhase === 1}
            >
              Previous
            </Button>
            
            <Button
              onClick={handlePhaseComplete}
              disabled={currentPhase === WORKFLOW_PHASES.length && completedPhases.has(currentPhase)}
            >
              {currentPhase === WORKFLOW_PHASES.length ? "Complete Workflow" : "Next Phase"}
            </Button>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Research Workflow Assistant</h1>
          <p className="text-muted-foreground">
            A guided journey from research question to proposal - step by step
          </p>
        </div>

        {/* Progress bar */}
        <Card className="p-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium">Overall Progress</span>
              <span className="text-muted-foreground">
                {completedPhases.size} of {WORKFLOW_PHASES.length} phases completed
              </span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        </Card>

        {/* Main layout: Phase navigator + Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Phase navigator sidebar */}
          <Card className="lg:col-span-1 p-4 h-fit">
            <h3 className="font-semibold mb-4">Workflow Phases</h3>
            <div className="space-y-2">
              {WORKFLOW_PHASES.map((phase) => {
                const status = getPhaseStatus(phase.id);
                const Icon = phase.icon;
                
                return (
                  <button
                    key={phase.id}
                    onClick={() => handleNavigateToPhase(phase.id)}
                    disabled={status === "locked"}
                    className={`
                      w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors
                      ${status === "current" ? "bg-primary text-primary-foreground" : ""}
                      ${status === "completed" ? "bg-green-50 dark:bg-green-950 text-green-900 dark:text-green-100" : ""}
                      ${status === "locked" ? "opacity-40 cursor-not-allowed" : "hover:bg-accent"}
                      ${status === "available" || status === "next" ? "hover:bg-accent" : ""}
                    `}
                  >
                    {status === "completed" && <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-green-600" />}
                    {status === "current" && <Circle className="h-4 w-4 flex-shrink-0 fill-current" />}
                    {status === "locked" && <Lock className="h-4 w-4 flex-shrink-0" />}
                    {(status === "available" || status === "next") && <Icon className="h-4 w-4 flex-shrink-0" />}
                    
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{phase.name}</div>
                      <div className="text-xs opacity-80 truncate">{phase.description}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </Card>

          {/* Main content area */}
          <div className="lg:col-span-3">
            {renderPhaseContent()}
          </div>
        </div>
      </div>
    </div>
  );
}
