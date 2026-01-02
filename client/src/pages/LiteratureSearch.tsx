import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { BookOpen, ExternalLink, Loader2, Save, Search } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function LiteratureSearch() {
  const { isAuthenticated } = useAuth();
  const [query, setQuery] = useState("");
  const [maxResults, setMaxResults] = useState(20);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedPaper, setSelectedPaper] = useState<any>(null);
  const [notes, setNotes] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);

  const { data: projects } = trpc.projects.list.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const searchMutation = trpc.literature.search.useMutation({
    onSuccess: (data) => {
      setSearchResults(data.papers);
      toast.success(`Found ${data.papers.length} papers`);
    },
    onError: (error) => {
      toast.error("Search failed: " + error.message);
    },
  });

  const savePaperMutation = trpc.literature.save.useMutation({
    onSuccess: () => {
      toast.success("Paper saved to project");
      setSelectedPaper(null);
      setNotes("");
    },
    onError: (error) => {
      toast.error("Failed to save paper: " + error.message);
    },
  });

  const handleSearch = () => {
    if (!query.trim()) {
      toast.error("Please enter a search query");
      return;
    }

    searchMutation.mutate({
      query: query.trim(),
      maxResults,
    });
  };

  const handleSavePaper = (paper: any) => {
    if (!selectedProjectId) {
      toast.error("Please select a project first");
      return;
    }

    savePaperMutation.mutate({
      projectId: selectedProjectId,
      pmid: paper.pmid,
      title: paper.title,
      authors: paper.authors,
      journal: paper.journal,
      year: parseInt(paper.year) || 0,
      doi: paper.doi,
      url: paper.url,
      notes,
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>
              Please log in to use the Literature Search tool.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Literature Search</h1>
          <p className="text-muted-foreground">
            Search PubMed for relevant research papers and save them to your projects
          </p>
        </div>

        {/* Search Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Search PubMed</CardTitle>
            <CardDescription>
              Enter keywords, authors, or topics to find relevant research papers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <Label htmlFor="query">Search Query</Label>
                  <Input
                    id="query"
                    placeholder="e.g., diabetes type 2 treatment, cardiovascular risk factors"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  />
                </div>
                <div className="w-32">
                  <Label htmlFor="maxResults">Max Results</Label>
                  <Select
                    value={maxResults.toString()}
                    onValueChange={(value) => setMaxResults(parseInt(value))}
                  >
                    <SelectTrigger id="maxResults">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                      <SelectItem value="100">100</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-4">
                {projects && projects.length > 0 && (
                  <div className="flex-1">
                    <Label htmlFor="project">Save to Project (Optional)</Label>
                    <Select
                      value={selectedProjectId?.toString() || ""}
                      onValueChange={(value) => setSelectedProjectId(parseInt(value))}
                    >
                      <SelectTrigger id="project">
                        <SelectValue placeholder="Select a project" />
                      </SelectTrigger>
                      <SelectContent>
                        {projects.map((project) => (
                          <SelectItem key={project.id} value={project.id.toString()}>
                            {project.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                <div className="flex items-end">
                  <Button
                    onClick={handleSearch}
                    disabled={searchMutation.isPending}
                    size="lg"
                  >
                    {searchMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Searching...
                      </>
                    ) : (
                      <>
                        <Search className="mr-2 h-4 w-4" />
                        Search
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Section */}
        {searchResults.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">
                Search Results ({searchResults.length})
              </h2>
            </div>

            {searchResults.map((paper, idx) => (
              <Card key={idx}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">{paper.title}</CardTitle>
                      <CardDescription>
                        <div className="space-y-1">
                          <p className="font-medium">{paper.authors}</p>
                          <p>
                            {paper.journal} • {paper.year}
                          </p>
                          {paper.doi && (
                            <p className="text-xs">DOI: {paper.doi}</p>
                          )}
                        </div>
                      </CardDescription>
                    </div>
                    <BookOpen className="h-8 w-8 text-muted-foreground flex-shrink-0" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                    >
                      <a href={paper.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        View on PubMed
                      </a>
                    </Button>
                    {selectedProjectId && (
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => {
                          setSelectedPaper(paper);
                        }}
                      >
                        <Save className="mr-2 h-4 w-4" />
                        Save to Project
                      </Button>
                    )}
                  </div>

                  {selectedPaper?.pmid === paper.pmid && (
                    <div className="mt-4 p-4 border rounded-lg bg-muted/50">
                      <Label htmlFor="notes">Notes (Optional)</Label>
                      <Textarea
                        id="notes"
                        placeholder="Add your notes about this paper..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="mt-2 mb-4"
                        rows={3}
                      />
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleSavePaper(paper)}
                          disabled={savePaperMutation.isPending}
                        >
                          {savePaperMutation.isPending ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Saving...
                            </>
                          ) : (
                            "Confirm Save"
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setSelectedPaper(null);
                            setNotes("");
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {searchResults.length === 0 && !searchMutation.isPending && (
          <Card>
            <CardContent className="py-12 text-center">
              <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Results Yet</h3>
              <p className="text-muted-foreground">
                Enter a search query above to find relevant research papers
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
