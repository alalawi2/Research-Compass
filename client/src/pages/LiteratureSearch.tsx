import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { BookOpen, ExternalLink, Loader2, Save, Search, Plus, Minus, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

interface SearchField {
  id: string;
  term: string;
  field: string;
  operator: string;
}

export default function LiteratureSearch() {
  const { isAuthenticated } = useAuth();
  const [query, setQuery] = useState("");
  const [maxResults, setMaxResults] = useState(20);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedPaper, setSelectedPaper] = useState<any>(null);
  const [notes, setNotes] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [advancedMode, setAdvancedMode] = useState(false);
  const [searchFields, setSearchFields] = useState<SearchField[]>([
    { id: '1', term: '', field: 'all', operator: 'AND' }
  ]);
  const [includedPapers, setIncludedPapers] = useState<Set<string>>(new Set());
  const [excludedPapers, setExcludedPapers] = useState<Set<string>>(new Set());
  const [expandedAbstracts, setExpandedAbstracts] = useState<Set<string>>(new Set());

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

  const buildAdvancedQuery = () => {
    return searchFields
      .filter(field => field.term.trim())
      .map((field, index) => {
        const term = field.term.trim();
        const fieldTag = field.field !== 'all' ? `[${field.field}]` : '';
        const prefix = index > 0 ? ` ${field.operator} ` : '';
        return `${prefix}${term}${fieldTag}`;
      })
      .join('');
  };

  const handleSearch = () => {
    const finalQuery = advancedMode ? buildAdvancedQuery() : query.trim();
    
    if (!finalQuery) {
      toast.error("Please enter a search query");
      return;
    }

    searchMutation.mutate({
      query: finalQuery,
      maxResults,
    });
  };

  const addSearchField = () => {
    setSearchFields([...searchFields, {
      id: Date.now().toString(),
      term: '',
      field: 'all',
      operator: 'AND'
    }]);
  };

  const removeSearchField = (id: string) => {
    if (searchFields.length > 1) {
      setSearchFields(searchFields.filter(field => field.id !== id));
    }
  };

  const updateSearchField = (id: string, updates: Partial<SearchField>) => {
    setSearchFields(searchFields.map(field =>
      field.id === id ? { ...field, ...updates } : field
    ));
  };

  const toggleInclude = (pmid: string) => {
    const newIncluded = new Set(includedPapers);
    const newExcluded = new Set(excludedPapers);
    
    if (newIncluded.has(pmid)) {
      newIncluded.delete(pmid);
    } else {
      newIncluded.add(pmid);
      newExcluded.delete(pmid);
    }
    
    setIncludedPapers(newIncluded);
    setExcludedPapers(newExcluded);
  };

  const toggleExclude = (pmid: string) => {
    const newIncluded = new Set(includedPapers);
    const newExcluded = new Set(excludedPapers);
    
    if (newExcluded.has(pmid)) {
      newExcluded.delete(pmid);
    } else {
      newExcluded.add(pmid);
      newIncluded.delete(pmid);
    }
    
    setIncludedPapers(newIncluded);
    setExcludedPapers(newExcluded);
  };

  const toggleAbstract = (pmid: string) => {
    const newExpanded = new Set(expandedAbstracts);
    if (newExpanded.has(pmid)) {
      newExpanded.delete(pmid);
    } else {
      newExpanded.add(pmid);
    }
    setExpandedAbstracts(newExpanded);
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
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Search PubMed</CardTitle>
                <CardDescription>
                  {advancedMode 
                    ? "Build a complex query using multiple fields and operators"
                    : "Enter keywords, authors, or topics to find relevant research papers"
                  }
                </CardDescription>
              </div>
              <Button
                variant="outline"
                onClick={() => setAdvancedMode(!advancedMode)}
              >
                {advancedMode ? "Simple Search" : "Advanced Search"}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {!advancedMode ? (
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
              ) : (
                <div className="space-y-4">
                  {searchFields.map((field, index) => (
                    <div key={field.id} className="flex gap-2 items-start">
                      {index > 0 && (
                        <Select
                          value={field.operator}
                          onValueChange={(value) => updateSearchField(field.id, { operator: value })}
                        >
                          <SelectTrigger className="w-24">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="AND">AND</SelectItem>
                            <SelectItem value="OR">OR</SelectItem>
                            <SelectItem value="NOT">NOT</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                      <Input
                        placeholder="Enter search term..."
                        value={field.term}
                        onChange={(e) => updateSearchField(field.id, { term: e.target.value })}
                        className="flex-1"
                      />
                      <Select
                        value={field.field}
                        onValueChange={(value) => updateSearchField(field.id, { field: value })}
                      >
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Fields</SelectItem>
                          <SelectItem value="tiab">Title/Abstract</SelectItem>
                          <SelectItem value="title">Title</SelectItem>
                          <SelectItem value="au">Author</SelectItem>
                          <SelectItem value="mesh">MeSH Terms</SelectItem>
                          <SelectItem value="journal">Journal</SelectItem>
                          <SelectItem value="affiliation">Affiliation</SelectItem>
                        </SelectContent>
                      </Select>
                      {searchFields.length > 1 && (
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => removeSearchField(field.id)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={addSearchField}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Field
                    </Button>
                    <Select
                      value={maxResults.toString()}
                      onValueChange={(value) => setMaxResults(parseInt(value))}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Max Results" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10">10 Results</SelectItem>
                        <SelectItem value="20">20 Results</SelectItem>
                        <SelectItem value="50">50 Results</SelectItem>
                        <SelectItem value="100">100 Results</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

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
              <div className="flex gap-2">
                <Badge variant="secondary">
                  {includedPapers.size} Included
                </Badge>
                <Badge variant="destructive">
                  {excludedPapers.size} Excluded
                </Badge>
              </div>
            </div>

            {searchResults.map((paper, idx) => {
              const isIncluded = includedPapers.has(paper.pmid);
              const isExcluded = excludedPapers.has(paper.pmid);
              const isExpanded = expandedAbstracts.has(paper.pmid);
              
              return (
                <Card 
                  key={idx}
                  className={
                    isIncluded ? "border-green-500 bg-green-50 dark:bg-green-950/20" :
                    isExcluded ? "border-red-500 bg-red-50 dark:bg-red-950/20 opacity-60" :
                    ""
                  }
                >
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-2 leading-tight">
                          {paper.title}
                        </CardTitle>
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
                    {/* Abstract Section */}
                    {paper.abstract && (
                      <div className="mb-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleAbstract(paper.pmid)}
                          className="mb-2 p-0 h-auto font-semibold"
                        >
                          {isExpanded ? (
                            <><ChevronUp className="mr-1 h-4 w-4" /> Hide Abstract</>
                          ) : (
                            <><ChevronDown className="mr-1 h-4 w-4" /> Show Abstract</>
                          )}
                        </Button>
                        {isExpanded && (
                          <div className="bg-muted/50 p-4 rounded-lg text-sm">
                            <p className="whitespace-pre-wrap">{paper.abstract}</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant={isIncluded ? "default" : "outline"}
                        size="sm"
                        onClick={() => toggleInclude(paper.pmid)}
                        className={isIncluded ? "bg-green-600 hover:bg-green-700" : ""}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        {isIncluded ? "Included" : "Include"}
                      </Button>
                      <Button
                        variant={isExcluded ? "destructive" : "outline"}
                        size="sm"
                        onClick={() => toggleExclude(paper.pmid)}
                      >
                        <Minus className="mr-2 h-4 w-4" />
                        {isExcluded ? "Excluded" : "Exclude"}
                      </Button>
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
                      {selectedProjectId && !isExcluded && (
                        <Button
                          variant="secondary"
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
            );
          })}
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
