import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Eye, FileCheck, Sparkles } from "lucide-react";
import type { ResearchWorkflowState } from "@shared/workflow-types";

interface ProposalGeneratorPhaseProps {
  workflowData: ResearchWorkflowState;
  onSave: () => void;
}

export default function ProposalGeneratorPhase({ 
  workflowData,
  onSave 
}: ProposalGeneratorPhaseProps) {
  const [generatedProposal, setGeneratedProposal] = useState("");
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    generateProposal();
  }, []);

  const generateProposal = () => {
    setGenerating(true);
    
    // Generate proposal from workflow data
    const sections = [];

    // Title
    if (workflowData.researchQuestion?.picoSummary) {
      sections.push(`# Research Proposal\n\n## Title\n\n${workflowData.researchQuestion.picoSummary}\n`);
    }

    // Abstract/Summary
    sections.push(`## Abstract\n\n`);
    if (workflowData.researchQuestion) {
      const rq = workflowData.researchQuestion;
      sections.push(`**Background:** This ${rq.studyType} study aims to investigate the relationship between ${rq.intervention || 'the intervention'} and ${rq.outcome} in ${rq.population}.\n\n`);
    }
    if (workflowData.rationale?.significance) {
      sections.push(`**Significance:** ${workflowData.rationale.significance.split('\n')[0]}\n\n`);
    }
    if (workflowData.sampleSize?.result) {
      sections.push(`**Methods:** We will recruit ${workflowData.sampleSize.result.totalSampleSize} participants.\n\n`);
    }
    if (workflowData.rationale?.expectedOutcomes) {
      sections.push(`**Expected Outcomes:** ${workflowData.rationale.expectedOutcomes.split('\n')[0]}\n\n`);
    }

    // Introduction & Background
    sections.push(`## 1. Introduction and Background\n\n`);
    if (workflowData.literatureSynthesis?.themes) {
      sections.push(`### Literature Review\n\n`);
      sections.push(`Our systematic review identified ${workflowData.literatureSynthesis.themes.length} major themes in the current literature:\n\n`);
      workflowData.literatureSynthesis.themes.forEach((theme, i) => {
        sections.push(`**${i + 1}. ${theme.name}**\n\n${theme.description}\n\n`);
        if (theme.keyFindings && theme.keyFindings.length > 0) {
          sections.push(`Key findings:\n`);
          theme.keyFindings.forEach(finding => {
            sections.push(`- ${finding}\n`);
          });
          sections.push(`\n`);
        }
      });
    }

    // Evidence Summary
    if (workflowData.literatureSynthesis?.evidenceTable && workflowData.literatureSynthesis.evidenceTable.length > 0) {
      sections.push(`### Evidence Summary\n\n`);
      sections.push(`| Study | Design | Sample Size | Key Findings | Quality |\n`);
      sections.push(`|-------|--------|-------------|--------------|----------|\n`);
      workflowData.literatureSynthesis.evidenceTable.forEach(evidence => {
        sections.push(`| ${evidence.study} | ${evidence.design} | ${evidence.sampleSize} | ${evidence.findings} | ${evidence.quality} |\n`);
      });
      sections.push(`\n`);
    }

    // Knowledge Gaps & Rationale
    sections.push(`## 2. Rationale and Significance\n\n`);
    if (workflowData.literatureSynthesis?.evidenceGaps && workflowData.literatureSynthesis.evidenceGaps.length > 0) {
      sections.push(`### Knowledge Gaps\n\n`);
      sections.push(`Despite extensive research, several important gaps remain:\n\n`);
      workflowData.literatureSynthesis.evidenceGaps.forEach((gap, i) => {
        sections.push(`${i + 1}. ${gap}\n`);
      });
      sections.push(`\n`);
    }
    if (workflowData.rationale) {
      const rat = workflowData.rationale;
      if (rat.significance) {
        sections.push(`### Significance\n\n${rat.significance}\n\n`);
      }
      if (rat.novelty) {
        sections.push(`### Novelty\n\n${rat.novelty}\n\n`);
      }
      if (rat.clinicalImpact) {
        sections.push(`### Clinical Impact\n\n${rat.clinicalImpact}\n\n`);
      }
    }

    // Research Question
    sections.push(`## 3. Research Question\n\n`);
    if (workflowData.researchQuestion) {
      const rq = workflowData.researchQuestion;
      sections.push(`**Primary Research Question:**\n\n${rq.picoSummary || 'Not specified'}\n\n`);
      sections.push(`**Study Type:** ${rq.studyType}\n\n`);
      sections.push(`**PICO Framework:**\n`);
      sections.push(`- **Population:** ${rq.population}\n`);
      if (rq.intervention) sections.push(`- **Intervention/Exposure:** ${rq.intervention}\n`);
      if (rq.comparison) sections.push(`- **Comparison:** ${rq.comparison}\n`);
      sections.push(`- **Outcome:** ${rq.outcome}\n\n`);
    }

    // Methods
    sections.push(`## 4. Methods\n\n`);
    if (workflowData.studyDesign) {
      sections.push(`### Study Design\n\n`);
      const sd = workflowData.studyDesign;
      if (sd.designType) sections.push(`**Design Type:** ${sd.designType}\n\n`);
      if (sd.setting) sections.push(`**Setting:** ${sd.setting}\n\n`);
      if (sd.population) sections.push(`**Population:** ${sd.population}\n\n`);
    }

    if (workflowData.sampleSize) {
      sections.push(`### Sample Size\n\n`);
      const ss = workflowData.sampleSize;
      if (ss.result) {
        sections.push(`**Required Sample Size:** ${ss.result.totalSampleSize} participants\n\n`);
        if (ss.result.perGroup) {
          sections.push(`**Per Group:** ${ss.result.perGroup} participants\n\n`);
        }
      }
      if (ss.justification) {
        sections.push(`**Justification:** ${ss.justification}\n\n`);
      }
    }

    if (workflowData.statisticalPlan) {
      sections.push(`### Statistical Analysis\n\n`);
      const sp = workflowData.statisticalPlan;
      if (sp.primaryOutcome) {
        sections.push(`**Primary Outcome:** ${sp.primaryOutcome}\n\n`);
      }
      if (sp.primaryAnalysis) {
        sections.push(`**Primary Analysis:** ${sp.primaryAnalysis}\n\n`);
      }
      if (sp.secondaryAnalyses && sp.secondaryAnalyses.length > 0) {
        sections.push(`**Secondary Analyses:**\n`);
        sp.secondaryAnalyses.forEach(analysis => {
          sections.push(`- ${analysis}\n`);
        });
        sections.push(`\n`);
      }
    }

    if (workflowData.methods) {
      sections.push(`### Data Collection and Procedures\n\n`);
      const m = workflowData.methods;
      if (m.dataCollection) {
        sections.push(`**Data Collection:** ${m.dataCollection}\n\n`);
      }
      if (m.procedures) {
        sections.push(`**Procedures:** ${m.procedures}\n\n`);
      }
    }

    // Timeline
    if (workflowData.timelineEthics) {
      sections.push(`## 5. Timeline and Ethics\n\n`);
      const te = workflowData.timelineEthics;
      if (te.totalDuration) {
        sections.push(`**Total Duration:** ${te.totalDuration}\n\n`);
      }
      if (te.phases && te.phases.length > 0) {
        sections.push(`**Project Phases:**\n\n`);
        te.phases.forEach(phase => {
          sections.push(`- **${phase.name}** (Months ${phase.startMonth}-${phase.endMonth}): ${phase.duration}\n`);
        });
        sections.push(`\n`);
      }
      if (te.ethicsApproval) {
        sections.push(`### Ethics Approval\n\n`);
        sections.push(`**Status:** ${te.ethicsApproval.status || 'Not started'}\n\n`);
        if (te.ethicsApproval.institution) {
          sections.push(`**Institution:** ${te.ethicsApproval.institution}\n\n`);
        }
      }
    }

    // Expected Outcomes
    if (workflowData.rationale?.expectedOutcomes) {
      sections.push(`## 6. Expected Outcomes and Impact\n\n`);
      sections.push(`${workflowData.rationale.expectedOutcomes}\n\n`);
    }

    // References placeholder
    if (workflowData.systematicReview?.includedPapers && workflowData.systematicReview.includedPapers.length > 0) {
      sections.push(`## 7. References\n\n`);
      workflowData.systematicReview.includedPapers.forEach((paper, i) => {
        sections.push(`${i + 1}. ${paper.authors}. ${paper.title}. ${paper.year}.\n`);
      });
    }

    const proposal = sections.join('');
    setGeneratedProposal(proposal);
    setGenerating(false);
  };

  const handleDownload = () => {
    const blob = new Blob([generatedProposal], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'research-proposal.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handlePreview = () => {
    const previewWindow = window.open('', '_blank');
    if (previewWindow) {
      previewWindow.document.write(`
        <html>
          <head>
            <title>Research Proposal Preview</title>
            <style>
              body { font-family: Georgia, serif; max-width: 800px; margin: 40px auto; padding: 20px; line-height: 1.6; }
              h1 { color: #1a1a1a; border-bottom: 2px solid #333; padding-bottom: 10px; }
              h2 { color: #2c3e50; margin-top: 30px; }
              h3 { color: #34495e; }
              table { border-collapse: collapse; width: 100%; margin: 20px 0; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f2f2f2; }
            </style>
          </head>
          <body>
            <pre style="white-space: pre-wrap; font-family: Georgia, serif;">${generatedProposal}</pre>
          </body>
        </html>
      `);
    }
  };

  const completedPhases = workflowData.completedPhases?.length || 0;
  const dataQuality = {
    hasResearchQuestion: !!workflowData.researchQuestion?.picoSummary,
    hasSynthesis: (workflowData.literatureSynthesis?.themes?.length || 0) > 0,
    hasRationale: !!workflowData.rationale?.significance,
    hasSampleSize: !!workflowData.sampleSize?.result,
  };

  const qualityScore = Object.values(dataQuality).filter(Boolean).length;

  return (
    <div className="space-y-6">
      {/* Overview */}
      <Card className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 border-green-200 dark:border-green-800">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0">
            <FileCheck className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2">Generate Research Proposal</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Auto-compiled from your workflow data - ready to download and customize!
            </p>
            <div className="flex gap-2 flex-wrap">
              <Badge variant={completedPhases >= 5 ? "default" : "secondary"}>
                {completedPhases} Phases Completed
              </Badge>
              <Badge variant={qualityScore >= 3 ? "default" : "secondary"}>
                Quality: {qualityScore}/4
              </Badge>
              {dataQuality.hasResearchQuestion && <Badge variant="outline">✓ Research Question</Badge>}
              {dataQuality.hasSynthesis && <Badge variant="outline">✓ Literature Synthesis</Badge>}
              {dataQuality.hasRationale && <Badge variant="outline">✓ Rationale</Badge>}
              {dataQuality.hasSampleSize && <Badge variant="outline">✓ Sample Size</Badge>}
            </div>
          </div>
        </div>
      </Card>

      {/* Generated Proposal */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-amber-600" />
            <h3 className="text-lg font-semibold">Your Auto-Generated Proposal</h3>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handlePreview}>
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
            <Button variant="default" size="sm" onClick={handleDownload}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        </div>

        <div className="border rounded-lg p-4 bg-muted/30 max-h-96 overflow-y-auto">
          <pre className="text-sm whitespace-pre-wrap font-mono">
            {generating ? "Generating proposal..." : generatedProposal}
          </pre>
        </div>

        {!generating && generatedProposal && (
          <div className="mt-4 p-3 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
            <p className="text-sm font-medium text-green-900 dark:text-green-100">
              ✓ Proposal generated successfully!
            </p>
            <p className="text-xs text-green-700 dark:text-green-300 mt-1">
              Download as Markdown and convert to Word/PDF using Pandoc or your preferred tool.
            </p>
          </div>
        )}
      </Card>

      {/* Next Steps */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-3">Next Steps</h3>
        <div className="space-y-2 text-sm">
          <div className="flex items-start gap-2">
            <FileText className="h-4 w-4 mt-1 text-primary" />
            <div>
              <p className="font-medium">Customize Your Proposal</p>
              <p className="text-muted-foreground">Edit the downloaded file to add institution-specific details, formatting, and final touches.</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <FileCheck className="h-4 w-4 mt-1 text-primary" />
            <div>
              <p className="font-medium">Review & Refine</p>
              <p className="text-muted-foreground">Have colleagues or mentors review your proposal for feedback.</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Download className="h-4 w-4 mt-1 text-primary" />
            <div>
              <p className="font-medium">Submit</p>
              <p className="text-muted-foreground">Submit to your ethics committee, funding agency, or academic program.</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Save */}
      <div className="flex justify-end pt-4 border-t">
        <Button onClick={onSave}>
          <FileCheck className="h-4 w-4 mr-2" />
          Save Workflow
        </Button>
      </div>
    </div>
  );
}
