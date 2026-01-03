import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Plus, X, ExternalLink } from "lucide-react";
import type { ExploratoryReview } from "@shared/workflow-types";

interface ExploratoryReviewPhaseProps {
  data?: ExploratoryReview;
  researchQuestion?: string;
  onSave: (data: ExploratoryReview) => void;
  onNext: () => void;
}

export default function ExploratoryReviewPhase({ 
  data, 
  researchQuestion,
  onSave, 
  onNext 
}: ExploratoryReviewPhaseProps) {
  const [reviewData, setReviewData] = useState<ExploratoryReview>(data || {
    keywords: [],
    initialSearches: [],
    keyPapers: [],
    knowledgeGaps: [],
  });

  const [newKeyword, setNewKeyword] = useState("");

  const handleAddKeyword = () => {
    if (newKeyword.trim() && !reviewData.keywords.includes(newKeyword.trim())) {
      setReviewData(prev => ({
        ...prev,
        keywords: [...prev.keywords, newKeyword.trim()],
      }));
      setNewKeyword("");
    }
  };

  const handleRemoveKeyword = (keyword: string) => {
    setReviewData(prev => ({
      ...prev,
      keywords: prev.keywords.filter(k => k !== keyword),
    }));
  };

  const handleSave = () => {
    onSave(reviewData);
  };

  const handleComplete = () => {
    handleSave();
    onNext();
  };

  return (
    <div className="space-y-6">
      {/* Overview */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border-blue-200 dark:border-blue-800">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
            <BookOpen className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2">Exploratory Literature Review</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Start with broad searches to understand the research landscape and identify initial papers.
            </p>
            {researchQuestion && (
              <div className="bg-white/50 dark:bg-black/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-xs font-medium mb-1">Your Research Question:</p>
                <p className="text-sm">{researchQuestion}</p>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Keywords */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Search Keywords</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Define key terms and concepts to use in your literature searches.
        </p>

        {reviewData.keywords.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {reviewData.keywords.map((keyword, index) => (
              <Badge key={index} variant="secondary" className="text-sm py-1 px-3">
                {keyword}
                <button
                  onClick={() => handleRemoveKeyword(keyword)}
                  className="ml-2 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}

        <div className="flex gap-2">
          <Input
            value={newKeyword}
            onChange={(e) => setNewKeyword(e.target.value)}
            placeholder="Enter a keyword (e.g., diabetes, intervention, RCT)"
            onKeyPress={(e) => e.key === 'Enter' && handleAddKeyword()}
          />
          <Button onClick={handleAddKeyword} disabled={!newKeyword.trim()}>
            <Plus className="h-4 w-4 mr-2" />
            Add
          </Button>
        </div>

        {reviewData.keywords.length > 0 && (
          <div className="mt-4 p-3 bg-muted/30 rounded-lg">
            <p className="text-sm font-medium mb-2">Suggested Search Combinations:</p>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p>• {reviewData.keywords.slice(0, 2).join(" AND ")}</p>
              <p>• {reviewData.keywords.slice(0, 3).join(" OR ")}</p>
              {reviewData.keywords.length > 3 && (
                <p>• ({reviewData.keywords.slice(0, 2).join(" OR ")}) AND {reviewData.keywords[2]}</p>
              )}
            </div>
          </div>
        )}
      </Card>

      {/* Link to Literature Search Tool */}
      <Card className="p-6 bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2">Ready to Search?</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Use the Literature Search tool to find papers using your keywords.
              You can save promising papers to review later.
            </p>
          </div>
          <Button asChild>
            <a href="/tools/literature" target="_blank" rel="noopener noreferrer">
              Open Literature Search
              <ExternalLink className="h-4 w-4 ml-2" />
            </a>
          </Button>
        </div>
      </Card>

      {/* Tips */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-3">Tips for Exploratory Review</h3>
        <div className="space-y-2 text-sm">
          <div className="flex items-start gap-2">
            <span className="text-primary font-bold">1.</span>
            <p>Start broad - use general terms to understand the field</p>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-primary font-bold">2.</span>
            <p>Look for recent review articles to get an overview</p>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-primary font-bold">3.</span>
            <p>Note frequently cited papers - they're likely important</p>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-primary font-bold">4.</span>
            <p>Keep track of search strategies that work well</p>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-primary font-bold">5.</span>
            <p>Don't aim for completeness yet - just get familiar with the literature</p>
          </div>
        </div>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between pt-4 border-t">
        <Button variant="outline" onClick={handleSave}>
          Save Progress
        </Button>
        
        <Button
          onClick={handleComplete}
          disabled={reviewData.keywords.length === 0}
        >
          Continue to Systematic Review
        </Button>
      </div>
    </div>
  );
}
