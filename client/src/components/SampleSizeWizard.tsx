import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, ArrowRight, Calculator, HelpCircle } from "lucide-react";
import { useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface WizardProps {
  onComplete: (params: {
    testType: string;
    alpha: string;
    power: string;
    effectSize: string;
    numGroups?: string;
    df?: string;
    ratio?: string;
    rho?: string;
    hazardRatio?: string;
    eventProbability?: string;
  }) => void;
  onCancel: () => void;
}

export function SampleSizeWizard({ onComplete, onCancel }: WizardProps) {
  const [step, setStep] = useState(1);
  const [researchType, setResearchType] = useState("");
  const [dataType, setDataType] = useState("");
  const [numGroups, setNumGroups] = useState("");
  const [pairedData, setPairedData] = useState("");
  const [normalDistribution, setNormalDistribution] = useState("");
  const [testType, setTestType] = useState("");
  
  // Parameters
  const [alpha, setAlpha] = useState("0.05");
  const [power, setPower] = useState("0.80");
  const [effectSize, setEffectSize] = useState("0.5");
  const [groupRatio, setGroupRatio] = useState("1");
  const [correlation, setCorrelation] = useState("0.3");
  const [hazardRatio, setHazardRatio] = useState("2");
  const [eventProb, setEventProb] = useState("0.5");
  const [anovaGroups, setAnovaGroups] = useState("3");
  const [chiSquareDf, setChiSquareDf] = useState("1");

  const totalSteps = 6;

  const determineTestType = () => {
    // Survival analysis
    if (researchType === "survival") {
      return "log-rank";
    }
    
    // Correlation
    if (researchType === "correlation") {
      return "correlation";
    }
    
    // Categorical data
    if (dataType === "categorical") {
      return "chi-square";
    }
    
    // Continuous data
    if (dataType === "continuous") {
      // Multiple groups
      if (numGroups === "multiple") {
        return normalDistribution === "yes" ? "anova" : "kruskal-wallis";
      }
      
      // Two groups
      if (numGroups === "two") {
        if (pairedData === "yes") {
          return normalDistribution === "yes" ? "ttest-paired" : "wilcoxon";
        } else {
          return normalDistribution === "yes" ? "ttest-independent" : "mann-whitney";
        }
      }
    }
    
    return "ttest-independent";
  };

  const getTestName = (test: string) => {
    const names: Record<string, string> = {
      "ttest-independent": "Independent T-Test",
      "ttest-paired": "Paired T-Test",
      "anova": "One-Way ANOVA",
      "chi-square": "Chi-Square Test",
      "mann-whitney": "Mann-Whitney U Test",
      "wilcoxon": "Wilcoxon Signed-Rank Test",
      "correlation": "Correlation Test",
      "log-rank": "Log-Rank Test (Survival Analysis)",
    };
    return names[test] || test;
  };

  const handleNext = () => {
    if (step === 4) {
      const determined = determineTestType();
      setTestType(determined);
    }
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleComplete = () => {
    const params: any = {
      testType,
      alpha,
      power,
      effectSize,
    };

    if (testType === "anova") {
      params.numGroups = anovaGroups;
    }
    if (testType === "chi-square") {
      params.df = chiSquareDf;
    }
    if (testType === "ttest-independent" || testType === "mann-whitney") {
      params.ratio = groupRatio;
    }
    if (testType === "correlation") {
      params.rho = correlation;
    }
    if (testType === "log-rank") {
      params.hazardRatio = hazardRatio;
      params.eventProbability = eventProb;
    }

    onComplete(params);
  };

  const HelpTooltip = ({ content }: { content: string }) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help inline-block ml-1" />
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <p>{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Sample Size Calculator - Step-by-Step Guide</CardTitle>
        <CardDescription>
          Answer a few simple questions to find the right sample size for your study
        </CardDescription>
        <div className="mt-4">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>Step {step} of {totalSteps}</span>
            <span>{Math.round((step / totalSteps) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
        </div>
      </CardHeader>

      <CardContent className="min-h-[400px]">
        {/* Step 1: Research Type */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">What type of research are you conducting?</h3>
              <RadioGroup value={researchType} onValueChange={setResearchType}>
                <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
                  <RadioGroupItem value="comparison" id="comparison" />
                  <Label htmlFor="comparison" className="cursor-pointer flex-1">
                    <div className="font-medium">Comparing Groups</div>
                    <div className="text-sm text-muted-foreground">
                      I want to compare outcomes between different groups (e.g., treatment vs control)
                    </div>
                  </Label>
                </div>

                <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
                  <RadioGroupItem value="correlation" id="correlation" />
                  <Label htmlFor="correlation" className="cursor-pointer flex-1">
                    <div className="font-medium">Studying Relationships</div>
                    <div className="text-sm text-muted-foreground">
                      I want to study the relationship between two variables (correlation)
                    </div>
                  </Label>
                </div>

                <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
                  <RadioGroupItem value="survival" id="survival" />
                  <Label htmlFor="survival" className="cursor-pointer flex-1">
                    <div className="font-medium">Survival Analysis</div>
                    <div className="text-sm text-muted-foreground">
                      I want to compare time-to-event outcomes (e.g., survival rates, time to recovery)
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        )}

        {/* Step 2: Data Type */}
        {step === 2 && researchType === "comparison" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">What type of data will you collect?</h3>
              <RadioGroup value={dataType} onValueChange={setDataType}>
                <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
                  <RadioGroupItem value="continuous" id="continuous" />
                  <Label htmlFor="continuous" className="cursor-pointer flex-1">
                    <div className="font-medium">Continuous/Numerical Data</div>
                    <div className="text-sm text-muted-foreground">
                      Measurements like height, weight, blood pressure, test scores (numbers with decimals)
                    </div>
                  </Label>
                </div>

                <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
                  <RadioGroupItem value="categorical" id="categorical" />
                  <Label htmlFor="categorical" className="cursor-pointer flex-1">
                    <div className="font-medium">Categorical Data</div>
                    <div className="text-sm text-muted-foreground">
                      Categories like yes/no, success/failure, disease present/absent
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        )}

        {/* Step 3: Number of Groups */}
        {step === 3 && researchType === "comparison" && dataType === "continuous" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">How many groups are you comparing?</h3>
              <RadioGroup value={numGroups} onValueChange={setNumGroups}>
                <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
                  <RadioGroupItem value="two" id="two" />
                  <Label htmlFor="two" className="cursor-pointer flex-1">
                    <div className="font-medium">Two Groups</div>
                    <div className="text-sm text-muted-foreground">
                      Example: Treatment vs Control, Male vs Female
                    </div>
                  </Label>
                </div>

                <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
                  <RadioGroupItem value="multiple" id="multiple" />
                  <Label htmlFor="multiple" className="cursor-pointer flex-1">
                    <div className="font-medium">Three or More Groups</div>
                    <div className="text-sm text-muted-foreground">
                      Example: Low/Medium/High dose, Multiple treatment arms
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        )}

        {/* Step 4: Paired Data & Distribution */}
        {step === 4 && researchType === "comparison" && dataType === "continuous" && numGroups === "two" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Are your measurements paired?</h3>
              <RadioGroup value={pairedData} onValueChange={setPairedData}>
                <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
                  <RadioGroupItem value="no" id="no-paired" />
                  <Label htmlFor="no-paired" className="cursor-pointer flex-1">
                    <div className="font-medium">No (Independent Groups)</div>
                    <div className="text-sm text-muted-foreground">
                      Different participants in each group
                    </div>
                  </Label>
                </div>

                <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
                  <RadioGroupItem value="yes" id="yes-paired" />
                  <Label htmlFor="yes-paired" className="cursor-pointer flex-1">
                    <div className="font-medium">Yes (Paired/Matched)</div>
                    <div className="text-sm text-muted-foreground">
                      Same participants measured twice (before/after) or matched pairs
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Is your data normally distributed?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                If unsure, choose "Yes" - most biological and clinical measurements follow a normal distribution
              </p>
              <RadioGroup value={normalDistribution} onValueChange={setNormalDistribution}>
                <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
                  <RadioGroupItem value="yes" id="yes-normal" />
                  <Label htmlFor="yes-normal" className="cursor-pointer flex-1">
                    <div className="font-medium">Yes (Parametric Test)</div>
                    <div className="text-sm text-muted-foreground">
                      Data follows a bell curve distribution
                    </div>
                  </Label>
                </div>

                <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
                  <RadioGroupItem value="no" id="no-normal" />
                  <Label htmlFor="no-normal" className="cursor-pointer flex-1">
                    <div className="font-medium">No (Non-parametric Test)</div>
                    <div className="text-sm text-muted-foreground">
                      Data is skewed or has outliers
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        )}

        {/* Step 5: Recommended Test */}
        {step === 5 && (
          <div className="space-y-6">
            <div className="p-6 bg-primary/10 rounded-lg border-2 border-primary">
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Recommended Statistical Test
              </h3>
              <p className="text-2xl font-bold text-primary mb-4">{getTestName(testType)}</p>
              <p className="text-sm text-muted-foreground">
                Based on your answers, this is the most appropriate test for your research design.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Now, let's set the statistical parameters:</h3>
              
              <div className="space-y-2">
                <Label htmlFor="wizard-alpha">
                  Significance Level (α)
                  <HelpTooltip content="The probability of falsely detecting an effect when there is none. Standard is 0.05 (5%)." />
                </Label>
                <Select value={alpha} onValueChange={setAlpha}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0.01">0.01 (1%) - Very strict</SelectItem>
                    <SelectItem value="0.05">0.05 (5%) - Standard</SelectItem>
                    <SelectItem value="0.10">0.10 (10%) - Lenient</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="wizard-power">
                  Statistical Power (1-β)
                  <HelpTooltip content="The probability of detecting an effect when it truly exists. Standard is 0.80 (80%)." />
                </Label>
                <Select value={power} onValueChange={setPower}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0.70">0.70 (70%) - Lower power</SelectItem>
                    <SelectItem value="0.80">0.80 (80%) - Standard</SelectItem>
                    <SelectItem value="0.90">0.90 (90%) - High power</SelectItem>
                    <SelectItem value="0.95">0.95 (95%) - Very high power</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {testType !== "correlation" && (
                <div className="space-y-2">
                  <Label htmlFor="wizard-effect">
                    Expected Effect Size
                    <HelpTooltip content="How big of a difference do you expect to see? Small = subtle difference, Large = obvious difference." />
                  </Label>
                  <Select value={effectSize} onValueChange={setEffectSize}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0.2">Small (0.2) - Subtle difference</SelectItem>
                      <SelectItem value="0.5">Medium (0.5) - Moderate difference</SelectItem>
                      <SelectItem value="0.8">Large (0.8) - Large difference</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {testType === "correlation" && (
                <div className="space-y-2">
                  <Label htmlFor="wizard-correlation">
                    Expected Correlation
                    <HelpTooltip content="How strongly do you expect the variables to be related? 0.1=weak, 0.3=moderate, 0.5=strong" />
                  </Label>
                  <Select value={correlation} onValueChange={setCorrelation}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0.1">Weak (0.1)</SelectItem>
                      <SelectItem value="0.3">Moderate (0.3)</SelectItem>
                      <SelectItem value="0.5">Strong (0.5)</SelectItem>
                      <SelectItem value="0.7">Very Strong (0.7)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {testType === "anova" && (
                <div className="space-y-2">
                  <Label htmlFor="wizard-groups">Number of Groups</Label>
                  <Input
                    id="wizard-groups"
                    type="number"
                    min="3"
                    value={anovaGroups}
                    onChange={(e) => setAnovaGroups(e.target.value)}
                  />
                </div>
              )}

              {testType === "chi-square" && (
                <div className="space-y-2">
                  <Label htmlFor="wizard-df">
                    Degrees of Freedom
                    <HelpTooltip content="For a 2x2 table, use 1. For larger tables, use (rows-1) × (columns-1)" />
                  </Label>
                  <Input
                    id="wizard-df"
                    type="number"
                    min="1"
                    value={chiSquareDf}
                    onChange={(e) => setChiSquareDf(e.target.value)}
                  />
                </div>
              )}

              {(testType === "ttest-independent" || testType === "mann-whitney") && (
                <div className="space-y-2">
                  <Label htmlFor="wizard-ratio">
                    Group Size Ratio
                    <HelpTooltip content="1 = equal groups, 2 = second group twice as large as first" />
                  </Label>
                  <Select value={groupRatio} onValueChange={setGroupRatio}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1:1 (Equal groups)</SelectItem>
                      <SelectItem value="2">1:2 (Second group twice as large)</SelectItem>
                      <SelectItem value="3">1:3 (Second group three times larger)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {testType === "log-rank" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="wizard-hr">
                      Expected Hazard Ratio
                      <HelpTooltip content="The ratio of event rates between groups. 2.0 means twice the rate in one group." />
                    </Label>
                    <Input
                      id="wizard-hr"
                      type="number"
                      step="0.1"
                      min="0.1"
                      value={hazardRatio}
                      onChange={(e) => setHazardRatio(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="wizard-event">
                      Event Probability
                      <HelpTooltip content="The proportion of participants expected to experience the event (0-1)" />
                    </Label>
                    <Input
                      id="wizard-event"
                      type="number"
                      step="0.05"
                      min="0"
                      max="1"
                      value={eventProb}
                      onChange={(e) => setEventProb(e.target.value)}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Step 6: Summary */}
        {step === 6 && (
          <div className="space-y-6">
            <div className="p-6 bg-green-50 dark:bg-green-950 rounded-lg border-2 border-green-500">
              <h3 className="text-lg font-semibold mb-4 text-green-700 dark:text-green-300">
                Ready to Calculate!
              </h3>
              <p className="text-sm mb-4">
                You've completed all the steps. Here's a summary of your selections:
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Statistical Test:</span>
                  <span className="font-semibold">{getTestName(testType)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Significance Level:</span>
                  <span className="font-semibold">{alpha}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Statistical Power:</span>
                  <span className="font-semibold">{power}</span>
                </div>
                {testType !== "correlation" && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Effect Size:</span>
                    <span className="font-semibold">{effectSize}</span>
                  </div>
                )}
                {testType === "correlation" && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Expected Correlation:</span>
                    <span className="font-semibold">{correlation}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                <strong>What happens next?</strong> Click "Calculate Sample Size" to see how many participants
                you need for your study. You'll also see a power curve showing the relationship between
                sample size and statistical power.
              </p>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8 pt-6 border-t">
          <div>
            {step > 1 && (
              <Button variant="outline" onClick={handleBack}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            )}
            {step === 1 && (
              <Button variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
          </div>

          <div>
            {step < totalSteps && (
              <Button
                onClick={handleNext}
                disabled={
                  (step === 1 && !researchType) ||
                  (step === 2 && !dataType && researchType === "comparison") ||
                  (step === 3 && !numGroups) ||
                  (step === 4 && (!pairedData || !normalDistribution)) ||
                  (step === 5 && !testType)
                }
              >
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
            {step === totalSteps && (
              <Button onClick={handleComplete} size="lg">
                <Calculator className="mr-2 h-4 w-4" />
                Calculate Sample Size
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
