import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MessageSquare, Sparkles, CheckCircle2 } from "lucide-react";
import type { ResearchQuestion } from "@shared/workflow-types";

interface ResearchQuestionPhaseProps {
  data?: ResearchQuestion;
  onSave: (data: ResearchQuestion) => void;
  onNext: () => void;
}

export default function ResearchQuestionPhase({ data, onSave, onNext }: ResearchQuestionPhaseProps) {
  const [formData, setFormData] = useState<ResearchQuestion>(data || {
    population: "",
    intervention: "",
    comparison: "",
    outcome: "",
    studyType: "interventional",
  });

  const [conversationStep, setConversationStep] = useState(0);
  const [showForm, setShowForm] = useState(false);

  const conversationSteps = [
    {
      question: "Let's start by defining your research question. What population are you studying?",
      hint: "e.g., adults with type 2 diabetes, children under 5, elderly patients with dementia",
      field: "population" as const
    },
    {
      question: "What intervention, exposure, or condition are you investigating?",
      hint: "e.g., new drug treatment, dietary intervention, risk factor, diagnostic test",
      field: "intervention" as const
    },
    {
      question: "What are you comparing it to?",
      hint: "e.g., placebo, standard treatment, control group, no exposure",
      field: "comparison" as const
    },
    {
      question: "What outcome are you measuring?",
      hint: "e.g., mortality, disease progression, quality of life, diagnostic accuracy",
      field: "outcome" as const
    }
  ];

  const handleFieldUpdate = (field: keyof ResearchQuestion, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (conversationStep < conversationSteps.length - 1) {
      setConversationStep(conversationStep + 1);
    } else {
      setShowForm(true);
    }
  };

  const handleSave = () => {
    const picoSummary = `In ${formData.population}, does ${formData.intervention} compared to ${formData.comparison} affect ${formData.outcome}?`;
    onSave({ ...formData, picoSummary });
  };

  const handleComplete = () => {
    handleSave();
    onNext();
  };

  const currentStep = conversationSteps[conversationStep];
  const isStepComplete = currentStep && (formData[currentStep.field]?.trim().length ?? 0) > 0;

  return (
    <div className="space-y-6">
      {/* Conversation Mode */}
      {!showForm ? (
        <Card className="p-6">
          <div className="space-y-6">
            {/* Progress indicator */}
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Question {conversationStep + 1} of {conversationSteps.length}</span>
              <span>{Math.round(((conversationStep + 1) / conversationSteps.length) * 100)}% complete</span>
            </div>

            {/* AI Avatar */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <div className="bg-muted p-4 rounded-lg rounded-tl-none">
                  <p className="font-medium mb-2">{currentStep.question}</p>
                  <p className="text-sm text-muted-foreground">{currentStep.hint}</p>
                </div>
              </div>
            </div>

            {/* Input Area */}
            <div className="space-y-3">
              <Textarea
                value={formData[currentStep.field] || ""}
                onChange={(e) => handleFieldUpdate(currentStep.field, e.target.value)}
                placeholder="Type your answer here..."
                className="min-h-[100px]"
                autoFocus
              />
              
              <div className="flex justify-between items-center">
                <Button
                  variant="outline"
                  onClick={() => setConversationStep(Math.max(0, conversationStep - 1))}
                  disabled={conversationStep === 0}
                >
                  Back
                </Button>

                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    onClick={() => setShowForm(true)}
                  >
                    Skip to form
                  </Button>

                  <Button
                    onClick={handleNext}
                    disabled={!isStepComplete}
                  >
                    {conversationStep === conversationSteps.length - 1 ? "Review" : "Continue"}
                  </Button>
                </div>
              </div>
            </div>

            {/* Previous answers summary */}
            {conversationStep > 0 && (
              <div className="border-t pt-4">
                <p className="text-sm font-medium mb-2">Your research question so far:</p>
                <div className="space-y-2">
                  {conversationSteps.slice(0, conversationStep).map((step, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="font-medium capitalize">{step.field}:</span>{" "}
                        <span className="text-muted-foreground">{formData[step.field]}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>
      ) : (
        /* Form Mode */
        <Card className="p-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Research Question Details</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowForm(false)}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Back to conversation
              </Button>
            </div>

            <div className="grid gap-6">
              <div className="space-y-2">
                <Label htmlFor="studyType">Study Type</Label>
                <Select
                  value={formData.studyType}
                  onValueChange={(value: any) => handleFieldUpdate("studyType", value)}
                >
                  <SelectTrigger id="studyType">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="interventional">Interventional (RCT, Clinical Trial)</SelectItem>
                    <SelectItem value="observational">Observational (Cohort, Case-Control)</SelectItem>
                    <SelectItem value="diagnostic">Diagnostic Accuracy Study</SelectItem>
                    <SelectItem value="prognostic">Prognostic Study</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="population">Population (P)</Label>
                <Textarea
                  id="population"
                  value={formData.population}
                  onChange={(e) => handleFieldUpdate("population", e.target.value)}
                  placeholder="Describe your target population..."
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="intervention">Intervention/Exposure (I/E)</Label>
                <Textarea
                  id="intervention"
                  value={formData.intervention || ""}
                  onChange={(e) => handleFieldUpdate("intervention", e.target.value)}
                  placeholder="Describe the intervention or exposure..."
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="comparison">Comparison (C)</Label>
                <Textarea
                  id="comparison"
                  value={formData.comparison || ""}
                  onChange={(e) => handleFieldUpdate("comparison", e.target.value)}
                  placeholder="Describe what you're comparing to..."
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="outcome">Outcome (O)</Label>
                <Textarea
                  id="outcome"
                  value={formData.outcome}
                  onChange={(e) => handleFieldUpdate("outcome", e.target.value)}
                  placeholder="Describe the outcome you're measuring..."
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="refinement">Additional Notes</Label>
                <Textarea
                  id="refinement"
                  value={formData.refinementNotes || ""}
                  onChange={(e) => handleFieldUpdate("refinementNotes", e.target.value)}
                  placeholder="Any additional context or refinements..."
                  rows={3}
                />
              </div>
            </div>

            {/* PICO Summary */}
            {formData.population && formData.outcome && (
              <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
                <p className="text-sm font-medium mb-2">Your PICO Question:</p>
                <p className="text-sm">
                  In <strong>{formData.population}</strong>, 
                  {formData.intervention && <> does <strong>{formData.intervention}</strong></>}
                  {formData.comparison && <> compared to <strong>{formData.comparison}</strong></>}
                  {" "}affect <strong>{formData.outcome}</strong>?
                </p>
              </div>
            )}

            <div className="flex justify-between pt-4 border-t">
              <Button
                variant="outline"
                onClick={handleSave}
              >
                Save Progress
              </Button>
              
              <Button
                onClick={handleComplete}
                disabled={!formData.population || !formData.outcome}
              >
                Complete & Continue
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
