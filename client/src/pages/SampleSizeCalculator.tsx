import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/lib/trpc";
import { Calculator, Loader2, Save } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function SampleSizeCalculator() {
  const { isAuthenticated } = useAuth();
  const [testType, setTestType] = useState<string>("ttest-independent");
  const [alpha, setAlpha] = useState("0.05");
  const [power, setPower] = useState("0.80");
  const [effectSize, setEffectSize] = useState("0.5");
  const [numGroups, setNumGroups] = useState("3");
  const [df, setDf] = useState("1");
  const [ratio, setRatio] = useState("1");
  const [rho, setRho] = useState("0.3");
  const [hazardRatio, setHazardRatio] = useState("2");
  const [eventProbability, setEventProbability] = useState("0.5");

  const calculateMutation = trpc.sampleSize.calculate.useMutation({
    onError: (error) => {
      toast.error("Calculation failed: " + error.message);
    },
  });

  const handleCalculate = () => {
    const params: any = {
      testType,
      alpha: parseFloat(alpha),
      power: parseFloat(power),
      effectSize: parseFloat(effectSize),
    };

    if (testType === "anova") {
      params.numGroups = parseInt(numGroups);
    }
    if (testType === "chi-square") {
      params.df = parseInt(df);
    }
    if (testType === "ttest-independent" || testType === "mann-whitney") {
      params.ratio = parseFloat(ratio);
    }
    if (testType === "correlation") {
      params.rho = parseFloat(rho);
    }
    if (testType === "log-rank") {
      params.hazardRatio = parseFloat(hazardRatio);
      params.eventProbability = parseFloat(eventProbability);
    }

    calculateMutation.mutate(params);
  };

  const testTypes = [
    { value: "ttest-independent", label: "Independent T-Test" },
    { value: "ttest-paired", label: "Paired T-Test" },
    { value: "anova", label: "One-Way ANOVA" },
    { value: "chi-square", label: "Chi-Square Test" },
    { value: "mann-whitney", label: "Mann-Whitney U Test" },
    { value: "wilcoxon", label: "Wilcoxon Signed-Rank Test" },
    { value: "correlation", label: "Correlation Test" },
    { value: "log-rank", label: "Log-Rank Test (Survival)" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Sample Size Calculator</h1>
          <p className="text-muted-foreground">
            Calculate required sample sizes for various statistical tests
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Input Panel */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Test Parameters</CardTitle>
                <CardDescription>
                  Select your statistical test and enter parameters
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Test Type Selection */}
                <div className="space-y-2">
                  <Label htmlFor="testType">Statistical Test</Label>
                  <Select value={testType} onValueChange={setTestType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {testTypes.map((test) => (
                        <SelectItem key={test.value} value={test.value}>
                          {test.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Common Parameters */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="alpha">Significance Level (α)</Label>
                    <Input
                      id="alpha"
                      type="number"
                      step="0.01"
                      min="0.001"
                      max="0.5"
                      value={alpha}
                      onChange={(e) => setAlpha(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Typical: 0.05 (5%)
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="power">Statistical Power (1-β)</Label>
                    <Input
                      id="power"
                      type="number"
                      step="0.01"
                      min="0.5"
                      max="0.999"
                      value={power}
                      onChange={(e) => setPower(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Typical: 0.80 (80%)
                    </p>
                  </div>
                </div>

                {/* Effect Size */}
                {testType !== "correlation" && (
                  <div className="space-y-2">
                    <Label htmlFor="effectSize">Effect Size (Cohen's d or w)</Label>
                    <Input
                      id="effectSize"
                      type="number"
                      step="0.1"
                      min="0.01"
                      value={effectSize}
                      onChange={(e) => setEffectSize(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Small: 0.2, Medium: 0.5, Large: 0.8
                    </p>
                  </div>
                )}

                {/* Test-Specific Parameters */}
                {testType === "anova" && (
                  <div className="space-y-2">
                    <Label htmlFor="numGroups">Number of Groups</Label>
                    <Input
                      id="numGroups"
                      type="number"
                      min="2"
                      value={numGroups}
                      onChange={(e) => setNumGroups(e.target.value)}
                    />
                  </div>
                )}

                {testType === "chi-square" && (
                  <div className="space-y-2">
                    <Label htmlFor="df">Degrees of Freedom</Label>
                    <Input
                      id="df"
                      type="number"
                      min="1"
                      value={df}
                      onChange={(e) => setDf(e.target.value)}
                    />
                  </div>
                )}

                {(testType === "ttest-independent" || testType === "mann-whitney") && (
                  <div className="space-y-2">
                    <Label htmlFor="ratio">Group Size Ratio (n2/n1)</Label>
                    <Input
                      id="ratio"
                      type="number"
                      step="0.1"
                      min="0.1"
                      value={ratio}
                      onChange={(e) => setRatio(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      1 = equal groups, 2 = group 2 twice as large
                    </p>
                  </div>
                )}

                {testType === "correlation" && (
                  <div className="space-y-2">
                    <Label htmlFor="rho">Expected Correlation (ρ)</Label>
                    <Input
                      id="rho"
                      type="number"
                      step="0.05"
                      min="-1"
                      max="1"
                      value={rho}
                      onChange={(e) => setRho(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Range: -1 to 1
                    </p>
                  </div>
                )}

                {testType === "log-rank" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="hazardRatio">Hazard Ratio</Label>
                      <Input
                        id="hazardRatio"
                        type="number"
                        step="0.1"
                        min="0.1"
                        value={hazardRatio}
                        onChange={(e) => setHazardRatio(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="eventProbability">Event Probability</Label>
                      <Input
                        id="eventProbability"
                        type="number"
                        step="0.05"
                        min="0"
                        max="1"
                        value={eventProbability}
                        onChange={(e) => setEventProbability(e.target.value)}
                      />
                    </div>
                  </div>
                )}

                <Button
                  onClick={handleCalculate}
                  disabled={calculateMutation.isPending}
                  className="w-full"
                  size="lg"
                >
                  {calculateMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Calculating...
                    </>
                  ) : (
                    <>
                      <Calculator className="mr-2 h-4 w-4" />
                      Calculate Sample Size
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Results Panel */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Results</CardTitle>
                <CardDescription>
                  Required sample size for your study
                </CardDescription>
              </CardHeader>
              <CardContent>
                {calculateMutation.data ? (
                  <div className="space-y-4">
                    <div className="p-6 bg-primary/10 rounded-lg text-center">
                      <p className="text-sm text-muted-foreground mb-2">
                        Sample Size Per Group
                      </p>
                      <p className="text-4xl font-bold text-primary">
                        {calculateMutation.data.sampleSize}
                      </p>
                    </div>

                    {calculateMutation.data.totalSampleSize && (
                      <div className="p-4 bg-muted rounded-lg text-center">
                        <p className="text-sm text-muted-foreground mb-1">
                          Total Sample Size
                        </p>
                        <p className="text-2xl font-semibold">
                          {calculateMutation.data.totalSampleSize}
                        </p>
                      </div>
                    )}

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Power:</span>
                        <span className="font-medium">
                          {(calculateMutation.data.power * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Alpha:</span>
                        <span className="font-medium">
                          {calculateMutation.data.alpha}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Effect Size:</span>
                        <span className="font-medium">
                          {calculateMutation.data.effectSize.toFixed(3)}
                        </span>
                      </div>
                    </div>

                    {calculateMutation.data.notes && (
                      <div className="p-3 bg-muted rounded text-sm">
                        <p className="font-medium mb-1">Notes:</p>
                        <p className="text-muted-foreground">
                          {calculateMutation.data.notes}
                        </p>
                      </div>
                    )}

                    {isAuthenticated && (
                      <Button variant="outline" className="w-full" size="sm">
                        <Save className="mr-2 h-4 w-4" />
                        Save to Project
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <Calculator className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Enter parameters and calculate to see results</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Information Tabs */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Understanding Sample Size Calculations</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="basics">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="basics">Basics</TabsTrigger>
                <TabsTrigger value="tests">Test Types</TabsTrigger>
                <TabsTrigger value="effect">Effect Sizes</TabsTrigger>
              </TabsList>
              
              <TabsContent value="basics" className="space-y-4 mt-4">
                <div>
                  <h3 className="font-semibold mb-2">Key Concepts</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li><strong>Significance Level (α):</strong> Probability of Type I error (false positive). Typically 0.05.</li>
                    <li><strong>Statistical Power (1-β):</strong> Probability of detecting a true effect. Typically 0.80.</li>
                    <li><strong>Effect Size:</strong> Magnitude of the difference you expect to detect.</li>
                    <li><strong>Sample Size:</strong> Number of participants needed to achieve desired power.</li>
                  </ul>
                </div>
              </TabsContent>

              <TabsContent value="tests" className="space-y-4 mt-4">
                <div>
                  <h3 className="font-semibold mb-2">When to Use Each Test</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li><strong>Independent T-Test:</strong> Compare means of two independent groups.</li>
                    <li><strong>Paired T-Test:</strong> Compare means of same group at two time points.</li>
                    <li><strong>ANOVA:</strong> Compare means of three or more groups.</li>
                    <li><strong>Chi-Square:</strong> Test association between categorical variables.</li>
                    <li><strong>Mann-Whitney U:</strong> Non-parametric alternative to independent t-test.</li>
                    <li><strong>Wilcoxon:</strong> Non-parametric alternative to paired t-test.</li>
                    <li><strong>Correlation:</strong> Test relationship between two continuous variables.</li>
                    <li><strong>Log-Rank:</strong> Compare survival curves between groups.</li>
                  </ul>
                </div>
              </TabsContent>

              <TabsContent value="effect" className="space-y-4 mt-4">
                <div>
                  <h3 className="font-semibold mb-2">Cohen's Effect Size Guidelines</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li><strong>Small Effect (d = 0.2):</strong> Subtle difference, requires larger sample.</li>
                    <li><strong>Medium Effect (d = 0.5):</strong> Noticeable difference, moderate sample.</li>
                    <li><strong>Large Effect (d = 0.8):</strong> Obvious difference, smaller sample needed.</li>
                  </ul>
                  <p className="text-sm text-muted-foreground mt-4">
                    Note: Use pilot data or literature to estimate realistic effect sizes for your study.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
