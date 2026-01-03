import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Target, Lightbulb, TrendingUp, CheckCircle2 } from "lucide-react";
import type { Rationale, LiteratureSynthesis } from "@shared/workflow-types";

interface RationalePhaseProps {
  data?: Rationale;
  synthesisData?: LiteratureSynthesis;
  onSave: (data: Rationale) => void;
  onNext: () => void;
}

export default function RationalePhase({ 
  data, 
  synthesisData,
  onSave, 
  onNext 
}: RationalePhaseProps) {
  const [rationaleData, setRationaleData] = useState<Rationale>(data || {
    significance: "",
    novelty: "",
    clinicalImpact: "",
    theoreticalContribution: "",
    feasibility: "",
    expectedOutcomes: "",
  });

  // Auto-populate from synthesis data
  useEffect(() => {
    if (synthesisData && !data) {
      const gaps = synthesisData.evidenceGaps || [];
      if (gaps.length > 0 && !rationaleData.significance) {
        const autoSignificance = `Current literature reveals several important gaps:\n\n${gaps.map((gap, i) => `${i + 1}. ${gap}`).join('\n\n')}`;
        setRationaleData(prev => ({
          ...prev,
          significance: autoSignificance,
        }));
      }
    }
  }, [synthesisData, data]);

  const handleUpdate = (field: keyof Rationale, value: string) => {
    setRationaleData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSave(rationaleData);
  };

  const handleComplete = () => {
    handleSave();
    onNext();
  };

  const isComplete = rationaleData.significance && rationaleData.novelty && rationaleData.expectedOutcomes;

  return (
    <div className="space-y-6">
      {/* Overview */}
      <Card className="p-6 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950 dark:to-orange-950 border-amber-200 dark:border-amber-800">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-amber-600 flex items-center justify-center flex-shrink-0">
            <Target className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2">Build Your Research Rationale</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Articulate why this research matters based on your literature synthesis.
            </p>
            {synthesisData?.evidenceGaps && synthesisData.evidenceGaps.length > 0 && (
              <div className="bg-white/50 dark:bg-black/20 p-3 rounded-lg border border-amber-200 dark:border-amber-800">
                <p className="text-xs font-medium mb-2">✨ Auto-populated from your literature synthesis</p>
                <p className="text-xs text-muted-foreground">
                  We've identified {synthesisData.evidenceGaps.length} knowledge gaps and {synthesisData.themes?.length || 0} themes
                </p>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Significance */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="h-5 w-5 text-amber-600" />
          <Label htmlFor="significance" className="text-lg font-semibold m-0">
            Research Significance
          </Label>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          Why is this research important? What problem does it address?
        </p>
        <Textarea
          id="significance"
          value={rationaleData.significance}
          onChange={(e) => handleUpdate("significance", e.target.value)}
          placeholder="Describe the significance and importance of your research..."
          rows={6}
          className="mb-2"
        />
        <p className="text-xs text-muted-foreground">
          Tip: Reference the knowledge gaps you identified in your literature synthesis
        </p>
      </Card>

      {/* Novelty */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-5 w-5 text-blue-600" />
          <Label htmlFor="novelty" className="text-lg font-semibold m-0">
            Novelty & Innovation
          </Label>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          What's new about your approach? How does it differ from existing research?
        </p>
        <Textarea
          id="novelty"
          value={rationaleData.novelty}
          onChange={(e) => handleUpdate("novelty", e.target.value)}
          placeholder="Explain what makes your research novel or innovative..."
          rows={6}
          className="mb-2"
        />
        <p className="text-xs text-muted-foreground">
          Tip: Highlight unique aspects of your methodology, population, or intervention
        </p>
      </Card>

      {/* Clinical/Practical Impact */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle2 className="h-5 w-5 text-green-600" />
          <Label htmlFor="impact" className="text-lg font-semibold m-0">
            Clinical/Practical Impact (Optional)
          </Label>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          How will this research benefit patients, practitioners, or policy?
        </p>
        <Textarea
          id="impact"
          value={rationaleData.clinicalImpact || ""}
          onChange={(e) => handleUpdate("clinicalImpact", e.target.value)}
          placeholder="Describe the potential clinical or practical applications..."
          rows={5}
        />
      </Card>

      {/* Theoretical Contribution */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Label htmlFor="theory" className="text-lg font-semibold m-0">
            Theoretical Contribution (Optional)
          </Label>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          What theoretical frameworks does this build upon or challenge?
        </p>
        <Textarea
          id="theory"
          value={rationaleData.theoreticalContribution || ""}
          onChange={(e) => handleUpdate("theoreticalContribution", e.target.value)}
          placeholder="Describe theoretical implications..."
          rows={4}
        />
      </Card>

      {/* Feasibility */}
      <Card className="p-6">
        <Label htmlFor="feasibility" className="text-lg font-semibold mb-4 block">
          Feasibility
        </Label>
        <p className="text-sm text-muted-foreground mb-4">
          Why is this research achievable with available resources and timeframe?
        </p>
        <Textarea
          id="feasibility"
          value={rationaleData.feasibility}
          onChange={(e) => handleUpdate("feasibility", e.target.value)}
          placeholder="Explain why this research is feasible..."
          rows={5}
        />
      </Card>

      {/* Expected Outcomes */}
      <Card className="p-6">
        <Label htmlFor="outcomes" className="text-lg font-semibold mb-4 block">
          Expected Outcomes
        </Label>
        <p className="text-sm text-muted-foreground mb-4">
          What results do you anticipate? What will you be able to conclude?
        </p>
        <Textarea
          id="outcomes"
          value={rationaleData.expectedOutcomes}
          onChange={(e) => handleUpdate("expectedOutcomes", e.target.value)}
          placeholder="Describe your expected outcomes and their implications..."
          rows={5}
        />
      </Card>

      {/* Navigation */}
      <div className="flex justify-between pt-4 border-t">
        <Button variant="outline" onClick={handleSave}>
          Save Progress
        </Button>
        
        <Button onClick={handleComplete} disabled={!isComplete}>
          Continue to Study Design
        </Button>
      </div>
    </div>
  );
}
