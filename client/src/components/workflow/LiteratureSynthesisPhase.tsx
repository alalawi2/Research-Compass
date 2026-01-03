import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Plus, 
  Trash2, 
  FileText, 
  Lightbulb, 
  AlertCircle,
  CheckCircle2,
  Sparkles
} from "lucide-react";
import type { LiteratureSynthesis, SystematicReview } from "@shared/workflow-types";

interface LiteratureSynthesisPhaseProps {
  data?: LiteratureSynthesis;
  systematicReviewData?: SystematicReview;
  onSave: (data: LiteratureSynthesis) => void;
  onNext: () => void;
}

export default function LiteratureSynthesisPhase({ 
  data, 
  systematicReviewData,
  onSave, 
  onNext 
}: LiteratureSynthesisPhaseProps) {
  const [synthesisData, setSynthesisData] = useState<LiteratureSynthesis>(data || {
    themes: [],
    evidenceTable: [],
    evidenceGaps: [],
    conflictingFindings: [],
    consensusPoints: [],
  });

  const [newTheme, setNewTheme] = useState({ name: "", description: "", keyFindings: [""] });
  const [newEvidence, setNewEvidence] = useState({
    study: "",
    design: "",
    sampleSize: 0,
    findings: "",
    quality: "moderate" as const,
  });
  const [newGap, setNewGap] = useState("");

  const handleAddTheme = () => {
    if (newTheme.name && newTheme.description) {
      setSynthesisData(prev => ({
        ...prev,
        themes: [
          ...prev.themes,
          {
            ...newTheme,
            paperCount: 0,
            keyFindings: newTheme.keyFindings.filter(f => f.trim() !== ""),
          }
        ],
      }));
      setNewTheme({ name: "", description: "", keyFindings: [""] });
    }
  };

  const handleAddEvidence = () => {
    if (newEvidence.study && newEvidence.findings) {
      setSynthesisData(prev => ({
        ...prev,
        evidenceTable: [...prev.evidenceTable, newEvidence],
      }));
      setNewEvidence({
        study: "",
        design: "",
        sampleSize: 0,
        findings: "",
        quality: "moderate",
      });
    }
  };

  const handleAddGap = () => {
    if (newGap.trim()) {
      setSynthesisData(prev => ({
        ...prev,
        evidenceGaps: [...prev.evidenceGaps, newGap],
      }));
      setNewGap("");
    }
  };

  const handleRemoveTheme = (index: number) => {
    setSynthesisData(prev => ({
      ...prev,
      themes: prev.themes.filter((_, i) => i !== index),
    }));
  };

  const handleRemoveEvidence = (index: number) => {
    setSynthesisData(prev => ({
      ...prev,
      evidenceTable: prev.evidenceTable.filter((_, i) => i !== index),
    }));
  };

  const handleRemoveGap = (index: number) => {
    setSynthesisData(prev => ({
      ...prev,
      evidenceGaps: prev.evidenceGaps.filter((_, i) => i !== index),
    }));
  };

  const handleSave = () => {
    onSave(synthesisData);
  };

  const handleComplete = () => {
    handleSave();
    onNext();
  };

  const includedPapersCount = systematicReviewData?.includedPapers?.length || 0;

  return (
    <div className="space-y-6">
      {/* Overview */}
      <Card className="p-6 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950 border-purple-200 dark:border-purple-800">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2">Literature Synthesis</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Extract themes, identify knowledge gaps, and create evidence summaries from your {includedPapersCount} included papers.
            </p>
            <div className="flex gap-2">
              <Badge variant="secondary">
                {synthesisData.themes.length} Themes
              </Badge>
              <Badge variant="secondary">
                {synthesisData.evidenceTable.length} Evidence Entries
              </Badge>
              <Badge variant="secondary">
                {synthesisData.evidenceGaps.length} Gaps Identified
              </Badge>
            </div>
          </div>
        </div>
      </Card>

      {/* Thematic Analysis */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="h-5 w-5 text-amber-600" />
          <h3 className="text-lg font-semibold">Thematic Analysis</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          Group findings into major themes emerging from the literature.
        </p>

        {/* Existing themes */}
        {synthesisData.themes.length > 0 && (
          <div className="space-y-3 mb-4">
            {synthesisData.themes.map((theme, index) => (
              <div key={index} className="border rounded-lg p-4 bg-muted/30">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="font-medium">{theme.name}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{theme.description}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveTheme(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                {theme.keyFindings.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {theme.keyFindings.map((finding, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>{finding}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Add new theme */}
        <div className="border rounded-lg p-4 space-y-3">
          <div className="grid gap-3">
            <div>
              <Label htmlFor="themeName">Theme Name</Label>
              <Input
                id="themeName"
                value={newTheme.name}
                onChange={(e) => setNewTheme(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Treatment Effectiveness"
              />
            </div>
            <div>
              <Label htmlFor="themeDesc">Description</Label>
              <Textarea
                id="themeDesc"
                value={newTheme.description}
                onChange={(e) => setNewTheme(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe what this theme encompasses..."
                rows={2}
              />
            </div>
            <div>
              <Label>Key Findings (optional)</Label>
              {newTheme.keyFindings.map((finding, idx) => (
                <Input
                  key={idx}
                  value={finding}
                  onChange={(e) => {
                    const updated = [...newTheme.keyFindings];
                    updated[idx] = e.target.value;
                    setNewTheme(prev => ({ ...prev, keyFindings: updated }));
                  }}
                  placeholder="Key finding..."
                  className="mb-2"
                />
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setNewTheme(prev => ({ 
                  ...prev, 
                  keyFindings: [...prev.keyFindings, ""] 
                }))}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Finding
              </Button>
            </div>
          </div>
          <Button onClick={handleAddTheme} disabled={!newTheme.name || !newTheme.description}>
            <Plus className="h-4 w-4 mr-2" />
            Add Theme
          </Button>
        </div>
      </Card>

      {/* Evidence Summary Table */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold">Evidence Summary Table</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          Create a publication-ready evidence table with quality ratings.
        </p>

        {synthesisData.evidenceTable.length > 0 && (
          <div className="border rounded-lg overflow-hidden mb-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Study</TableHead>
                  <TableHead>Design</TableHead>
                  <TableHead>Sample Size</TableHead>
                  <TableHead>Key Findings</TableHead>
                  <TableHead>Quality</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {synthesisData.evidenceTable.map((evidence, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{evidence.study}</TableCell>
                    <TableCell>{evidence.design}</TableCell>
                    <TableCell>{evidence.sampleSize}</TableCell>
                    <TableCell className="max-w-md">{evidence.findings}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          evidence.quality === "high" ? "default" :
                          evidence.quality === "moderate" ? "secondary" :
                          "outline"
                        }
                      >
                        {evidence.quality}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveEvidence(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Add new evidence */}
        <div className="border rounded-lg p-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="evidenceStudy">Study (Author, Year)</Label>
              <Input
                id="evidenceStudy"
                value={newEvidence.study}
                onChange={(e) => setNewEvidence(prev => ({ ...prev, study: e.target.value }))}
                placeholder="e.g., Smith et al., 2023"
              />
            </div>
            <div>
              <Label htmlFor="evidenceDesign">Study Design</Label>
              <Input
                id="evidenceDesign"
                value={newEvidence.design}
                onChange={(e) => setNewEvidence(prev => ({ ...prev, design: e.target.value }))}
                placeholder="e.g., RCT, Cohort"
              />
            </div>
            <div>
              <Label htmlFor="evidenceSample">Sample Size</Label>
              <Input
                id="evidenceSample"
                type="number"
                value={newEvidence.sampleSize || ""}
                onChange={(e) => setNewEvidence(prev => ({ 
                  ...prev, 
                  sampleSize: parseInt(e.target.value) || 0 
                }))}
                placeholder="100"
              />
            </div>
            <div>
              <Label htmlFor="evidenceQuality">Quality Rating</Label>
              <Select
                value={newEvidence.quality}
                onValueChange={(value: any) => setNewEvidence(prev => ({ 
                  ...prev, 
                  quality: value 
                }))}
              >
                <SelectTrigger id="evidenceQuality">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High Quality</SelectItem>
                  <SelectItem value="moderate">Moderate Quality</SelectItem>
                  <SelectItem value="low">Low Quality</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label htmlFor="evidenceFindings">Key Findings</Label>
            <Textarea
              id="evidenceFindings"
              value={newEvidence.findings}
              onChange={(e) => setNewEvidence(prev => ({ ...prev, findings: e.target.value }))}
              placeholder="Summarize the main findings..."
              rows={2}
            />
          </div>
          <Button 
            onClick={handleAddEvidence} 
            disabled={!newEvidence.study || !newEvidence.findings}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Evidence
          </Button>
        </div>
      </Card>

      {/* Knowledge Gaps */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <AlertCircle className="h-5 w-5 text-orange-600" />
          <h3 className="text-lg font-semibold">Knowledge Gaps</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          Identify gaps in the current literature that justify your research.
        </p>

        {synthesisData.evidenceGaps.length > 0 && (
          <div className="space-y-2 mb-4">
            {synthesisData.evidenceGaps.map((gap, index) => (
              <div key={index} className="flex items-start gap-2 p-3 bg-orange-50 dark:bg-orange-950 border border-orange-200 dark:border-orange-800 rounded-lg">
                <AlertCircle className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                <span className="flex-1 text-sm">{gap}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveGap(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-2">
          <Input
            value={newGap}
            onChange={(e) => setNewGap(e.target.value)}
            placeholder="Describe a gap in the literature..."
            onKeyPress={(e) => e.key === 'Enter' && handleAddGap()}
          />
          <Button onClick={handleAddGap} disabled={!newGap.trim()}>
            <Plus className="h-4 w-4 mr-2" />
            Add Gap
          </Button>
        </div>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between pt-4 border-t">
        <Button variant="outline" onClick={handleSave}>
          Save Progress
        </Button>
        
        <Button
          onClick={handleComplete}
          disabled={synthesisData.themes.length === 0 && synthesisData.evidenceGaps.length === 0}
        >
          Complete & Continue
        </Button>
      </div>
    </div>
  );
}
