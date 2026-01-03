import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { Download, FileText, Loader2, Save, Sparkles, Wand2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Streamdown } from "streamdown";
import { exportProposalToPDF } from "@/lib/exportPDF";
import { exportProposalToWord } from "@/lib/exportWord";

export default function ProposalWriter() {
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState("introduction");
  const [showOutlineDialog, setShowOutlineDialog] = useState(false);
  const [researchQuestion, setResearchQuestion] = useState("");
  const [studyType, setStudyType] = useState("");
  const [generatedOutline, setGeneratedOutline] = useState("");
  
  const [introduction, setIntroduction] = useState("");
  const [methods, setMethods] = useState("");
  const [results, setResults] = useState("");
  const [discussion, setDiscussion] = useState("");
  const [references, setReferences] = useState("");

  const generateOutlineMutation = trpc.proposals.generateOutline.useMutation({
    onSuccess: (data) => {
      const outline = typeof data.outline === 'string' ? data.outline : '';
      setGeneratedOutline(outline);
      toast.success("Outline generated successfully");
    },
    onError: (error) => {
      toast.error("Failed to generate outline: " + error.message);
    },
  });

  const improveSectionMutation = trpc.proposals.improveSection.useMutation({
    onSuccess: (data) => {
      // Update the appropriate section with improved content
      const content = typeof data.improvedContent === 'string' ? data.improvedContent : '';
      switch (activeTab) {
        case "introduction":
          setIntroduction(content);
          break;
        case "methods":
          setMethods(content);
          break;
        case "results":
          setResults(content);
          break;
        case "discussion":
          setDiscussion(content);
          break;
      }
      toast.success("Section improved successfully");
    },
    onError: (error) => {
      toast.error("Failed to improve section: " + error.message);
    },
  });

  const handleGenerateOutline = () => {
    if (!researchQuestion.trim() || !studyType.trim()) {
      toast.error("Please enter research question and study type");
      return;
    }
    generateOutlineMutation.mutate({ researchQuestion, studyType });
  };

  const handleImproveSection = () => {
    let content = "";
    let section = "";
    
    switch (activeTab) {
      case "introduction":
        content = introduction;
        section = "Introduction";
        break;
      case "methods":
        content = methods;
        section = "Methods";
        break;
      case "results":
        content = results;
        section = "Results";
        break;
      case "discussion":
        content = discussion;
        section = "Discussion";
        break;
      default:
        return;
    }

    if (!content.trim()) {
      toast.error("Please write some content first");
      return;
    }

    improveSectionMutation.mutate({ section, content });
  };

  const sections = [
    {
      id: "introduction",
      title: "Introduction",
      placeholder: "Background, significance, research question, objectives...",
      content: introduction,
      setContent: setIntroduction,
      tips: [
        "Start with broad context and narrow to specific problem",
        "Clearly state research question and objectives",
        "Justify significance and potential impact",
        "Review relevant literature briefly"
      ]
    },
    {
      id: "methods",
      title: "Methods",
      placeholder: "Study design, participants, procedures, data collection, analysis...",
      content: methods,
      setContent: setMethods,
      tips: [
        "Describe study design and rationale",
        "Detail participant selection and sample size",
        "Explain data collection procedures",
        "Specify statistical analysis methods"
      ]
    },
    {
      id: "results",
      title: "Expected Results",
      placeholder: "Anticipated findings, outcomes, deliverables...",
      content: results,
      setContent: setResults,
      tips: [
        "Describe expected primary outcomes",
        "Outline secondary outcomes",
        "Mention planned tables and figures",
        "Address potential scenarios"
      ]
    },
    {
      id: "discussion",
      title: "Discussion & Impact",
      placeholder: "Interpretation, implications, limitations, future directions...",
      content: discussion,
      setContent: setDiscussion,
      tips: [
        "Interpret expected findings",
        "Discuss clinical/scientific implications",
        "Acknowledge potential limitations",
        "Suggest future research directions"
      ]
    },
    {
      id: "references",
      title: "References",
      placeholder: "List your references here...",
      content: references,
      setContent: setReferences,
      tips: [
        "Use consistent citation style (APA, Vancouver, etc.)",
        "Include all cited works",
        "Ensure references are recent and relevant",
        "Check for completeness and accuracy"
      ]
    }
  ];

  const currentSection = sections.find(s => s.id === activeTab);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>
              Please log in to use the AI-assisted proposal writer.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8 max-w-6xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">AI Proposal Writer</h1>
            <p className="text-muted-foreground">
              Create research proposals with AI assistance
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowOutlineDialog(true)}>
              <Sparkles className="mr-2 h-4 w-4" />
              Generate Outline
            </Button>
            <Button variant="outline">
              <Save className="mr-2 h-4 w-4" />
              Save Draft
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                exportProposalToPDF({
                  title: 'Research Proposal',
                  sections: [
                    { title: 'Introduction', content: introduction },
                    { title: 'Methods', content: methods },
                    { title: 'Results', content: results },
                    { title: 'Discussion', content: discussion },
                    { title: 'References', content: references },
                  ],
                });
                toast.success('PDF exported successfully');
              }}
            >
              <Download className="mr-2 h-4 w-4" />
              Export PDF
            </Button>
            <Button
              variant="outline"
              onClick={async () => {
                await exportProposalToWord({
                  title: 'Research Proposal',
                  sections: [
                    { title: 'Introduction', content: introduction },
                    { title: 'Methods', content: methods },
                    { title: 'Results', content: results },
                    { title: 'Discussion', content: discussion },
                    { title: 'References', content: references },
                  ],
                });
                toast.success('Word document exported successfully');
              }}
            >
              <FileText className="mr-2 h-4 w-4" />
              Export Word
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Editor Panel */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>Proposal Sections</CardTitle>
                <CardDescription>
                  Follow the IMRAD format for your research proposal
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="introduction">Introduction</TabsTrigger>
                    <TabsTrigger value="methods">Methods</TabsTrigger>
                    <TabsTrigger value="results">Results</TabsTrigger>
                    <TabsTrigger value="discussion">Discussion</TabsTrigger>
                    <TabsTrigger value="references">References</TabsTrigger>
                  </TabsList>

                  {sections.map((section) => (
                    <TabsContent key={section.id} value={section.id} className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold">{section.title}</h3>
                        {section.id !== "references" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={handleImproveSection}
                            disabled={improveSectionMutation.isPending}
                          >
                            {improveSectionMutation.isPending ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Improving...
                              </>
                            ) : (
                              <>
                                <Wand2 className="mr-2 h-4 w-4" />
                                Improve with AI
                              </>
                            )}
                          </Button>
                        )}
                      </div>
                      
                      <Textarea
                        placeholder={section.placeholder}
                        value={section.content}
                        onChange={(e) => section.setContent(e.target.value)}
                        rows={15}
                        className="font-mono text-sm"
                      />

                      <div className="text-sm text-muted-foreground">
                        {section.content.split(/\s+/).filter(Boolean).length} words
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Tips Panel */}
          <div>
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="text-lg">Writing Tips</CardTitle>
              </CardHeader>
              <CardContent>
                {currentSection && (
                  <ul className="space-y-3 text-sm">
                    {currentSection.tips.map((tip, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-primary mt-0.5">•</span>
                        <span className="text-muted-foreground">{tip}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Outline Generation Dialog */}
        <Dialog open={showOutlineDialog} onOpenChange={setShowOutlineDialog}>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Generate Proposal Outline</DialogTitle>
              <DialogDescription>
                Get AI-generated outline based on your research question
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="researchQuestion">Research Question</Label>
                <Textarea
                  id="researchQuestion"
                  placeholder="What is your main research question?"
                  value={researchQuestion}
                  onChange={(e) => setResearchQuestion(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="studyType">Study Type</Label>
                <Input
                  id="studyType"
                  placeholder="e.g., RCT, Cohort Study, Cross-sectional"
                  value={studyType}
                  onChange={(e) => setStudyType(e.target.value)}
                />
              </div>

              <Button
                onClick={handleGenerateOutline}
                disabled={generateOutlineMutation.isPending}
                className="w-full"
              >
                {generateOutlineMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate Outline
                  </>
                )}
              </Button>

              {generatedOutline && (
                <div className="mt-6 p-4 bg-muted rounded-lg">
                  <h4 className="font-semibold mb-3">Generated Outline:</h4>
                  <div className="prose prose-sm max-w-none">
                    <Streamdown>{generatedOutline}</Streamdown>
                  </div>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowOutlineDialog(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
