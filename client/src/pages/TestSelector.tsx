import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ArrowLeft, ArrowRight, CheckCircle2, FlaskRound } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

interface TestRecommendation {
  name: string;
  description: string;
  assumptions: string[];
  example: string;
  sampleSizeLink?: string;
}

const tests: Record<string, TestRecommendation> = {
  independentTTest: {
    name: "Independent Samples T-Test",
    description: "Compare means of two independent groups when data is normally distributed.",
    assumptions: [
      "Data is continuous and normally distributed",
      "Independent observations",
      "Equal variances (or use Welch's t-test)",
      "No significant outliers"
    ],
    example: "Comparing blood pressure between treatment and control groups",
    sampleSizeLink: "/tools/sample-size"
  },
  pairedTTest: {
    name: "Paired Samples T-Test",
    description: "Compare means of the same group at two different times or under two conditions.",
    assumptions: [
      "Data is continuous and normally distributed",
      "Paired observations (same subjects)",
      "Differences are normally distributed",
      "No significant outliers in differences"
    ],
    example: "Comparing blood pressure before and after treatment in the same patients",
    sampleSizeLink: "/tools/sample-size"
  },
  anova: {
    name: "One-Way ANOVA",
    description: "Compare means of three or more independent groups.",
    assumptions: [
      "Data is continuous and normally distributed",
      "Independent observations",
      "Homogeneity of variances",
      "No significant outliers"
    ],
    example: "Comparing pain scores across three different treatment groups",
    sampleSizeLink: "/tools/sample-size"
  },
  mannWhitney: {
    name: "Mann-Whitney U Test",
    description: "Non-parametric alternative to independent t-test for comparing two groups.",
    assumptions: [
      "Ordinal or continuous data",
      "Independent observations",
      "Similar distribution shapes (for median comparison)"
    ],
    example: "Comparing satisfaction scores (1-5 scale) between two groups",
    sampleSizeLink: "/tools/sample-size"
  },
  wilcoxon: {
    name: "Wilcoxon Signed-Rank Test",
    description: "Non-parametric alternative to paired t-test.",
    assumptions: [
      "Ordinal or continuous data",
      "Paired observations",
      "Symmetric distribution of differences"
    ],
    example: "Comparing pain scores before and after treatment (non-normal data)",
    sampleSizeLink: "/tools/sample-size"
  },
  kruskalWallis: {
    name: "Kruskal-Wallis Test",
    description: "Non-parametric alternative to one-way ANOVA for three or more groups.",
    assumptions: [
      "Ordinal or continuous data",
      "Independent observations",
      "Similar distribution shapes"
    ],
    example: "Comparing quality of life scores across multiple treatment groups"
  },
  chiSquare: {
    name: "Chi-Square Test",
    description: "Test association between two categorical variables.",
    assumptions: [
      "Categorical data",
      "Independent observations",
      "Expected frequency ≥ 5 in each cell",
      "Large enough sample size"
    ],
    example: "Testing if treatment outcome (success/failure) differs by gender",
    sampleSizeLink: "/tools/sample-size"
  },
  fisherExact: {
    name: "Fisher's Exact Test",
    description: "Test association between two categorical variables with small sample sizes.",
    assumptions: [
      "Categorical data (2x2 table)",
      "Independent observations",
      "Used when expected frequencies < 5"
    ],
    example: "Testing association between rare disease and exposure in small sample"
  },
  pearsonCorrelation: {
    name: "Pearson Correlation",
    description: "Measure linear relationship between two continuous variables.",
    assumptions: [
      "Both variables are continuous",
      "Linear relationship",
      "Bivariate normal distribution",
      "No significant outliers"
    ],
    example: "Correlation between age and blood pressure",
    sampleSizeLink: "/tools/sample-size"
  },
  spearmanCorrelation: {
    name: "Spearman Correlation",
    description: "Non-parametric measure of monotonic relationship between variables.",
    assumptions: [
      "Ordinal or continuous data",
      "Monotonic relationship",
      "Independent observations"
    ],
    example: "Correlation between ranked preferences and outcomes"
  },
  logRank: {
    name: "Log-Rank Test",
    description: "Compare survival curves between two or more groups.",
    assumptions: [
      "Time-to-event data",
      "Censored observations handled",
      "Proportional hazards",
      "Independent censoring"
    ],
    example: "Comparing survival time between treatment and control groups",
    sampleSizeLink: "/tools/sample-size"
  }
};

export default function TestSelector() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [recommendation, setRecommendation] = useState<TestRecommendation | null>(null);

  const questions = [
    {
      id: 0,
      question: "What type of data do you have?",
      options: [
        { value: "continuous", label: "Continuous (measurements like weight, blood pressure)" },
        { value: "categorical", label: "Categorical (groups like yes/no, male/female)" },
        { value: "ordinal", label: "Ordinal (ranked data like pain scale 1-10)" },
        { value: "survival", label: "Time-to-event / Survival data" }
      ]
    },
    {
      id: 1,
      question: "How many groups are you comparing?",
      options: [
        { value: "two", label: "Two groups" },
        { value: "three-plus", label: "Three or more groups" },
        { value: "correlation", label: "Not comparing groups - looking at relationship" }
      ],
      showIf: (ans: Record<number, string>) => ans[0] === "continuous" || ans[0] === "ordinal"
    },
    {
      id: 2,
      question: "Are the groups independent or paired?",
      options: [
        { value: "independent", label: "Independent (different subjects in each group)" },
        { value: "paired", label: "Paired (same subjects measured twice or matched pairs)" }
      ],
      showIf: (ans: Record<number, string>) => 
        (ans[0] === "continuous" || ans[0] === "ordinal") && ans[1] === "two"
    },
    {
      id: 3,
      question: "Is your data normally distributed?",
      options: [
        { value: "yes", label: "Yes, data is normally distributed" },
        { value: "no", label: "No, data is not normally distributed or unsure" }
      ],
      showIf: (ans: Record<number, string>) => 
        ans[0] === "continuous" && (ans[1] === "two" || ans[1] === "three-plus")
    },
    {
      id: 4,
      question: "What is your table structure?",
      options: [
        { value: "2x2", label: "2x2 table (two variables, each with two categories)" },
        { value: "larger", label: "Larger than 2x2" }
      ],
      showIf: (ans: Record<number, string>) => ans[0] === "categorical"
    },
    {
      id: 5,
      question: "Do you have small expected frequencies (< 5 in any cell)?",
      options: [
        { value: "yes", label: "Yes, small expected frequencies" },
        { value: "no", label: "No, all expected frequencies ≥ 5" }
      ],
      showIf: (ans: Record<number, string>) => ans[0] === "categorical" && ans[4] === "2x2"
    }
  ];

  const determineTest = (ans: Record<number, string>): TestRecommendation => {
    // Survival data
    if (ans[0] === "survival") {
      return tests.logRank;
    }

    // Categorical data
    if (ans[0] === "categorical") {
      if (ans[4] === "2x2" && ans[5] === "yes") {
        return tests.fisherExact;
      }
      return tests.chiSquare;
    }

    // Correlation
    if (ans[1] === "correlation") {
      if (ans[0] === "continuous" && ans[3] === "yes") {
        return tests.pearsonCorrelation;
      }
      return tests.spearmanCorrelation;
    }

    // Two groups
    if (ans[1] === "two") {
      if (ans[2] === "independent") {
        if (ans[0] === "continuous" && ans[3] === "yes") {
          return tests.independentTTest;
        }
        return tests.mannWhitney;
      } else {
        // Paired
        if (ans[0] === "continuous" && ans[3] === "yes") {
          return tests.pairedTTest;
        }
        return tests.wilcoxon;
      }
    }

    // Three or more groups
    if (ans[1] === "three-plus") {
      if (ans[0] === "continuous" && ans[3] === "yes") {
        return tests.anova;
      }
      return tests.kruskalWallis;
    }

    return tests.independentTTest;
  };

  const handleAnswer = (value: string) => {
    const newAnswers = { ...answers, [step]: value };
    setAnswers(newAnswers);

    // Check if we should show next question or finish
    const nextQuestions = questions.filter((q, idx) => 
      idx > step && (!q.showIf || q.showIf(newAnswers))
    );

    if (nextQuestions.length === 0) {
      // No more questions, show recommendation
      setRecommendation(determineTest(newAnswers));
    } else {
      // Move to next question
      setStep(nextQuestions[0].id);
    }
  };

  const handleBack = () => {
    const previousQuestions = questions.filter((q, idx) => 
      idx < step && (!q.showIf || q.showIf(answers))
    );
    
    if (previousQuestions.length > 0) {
      setStep(previousQuestions[previousQuestions.length - 1].id);
      setRecommendation(null);
    }
  };

  const handleReset = () => {
    setStep(0);
    setAnswers({});
    setRecommendation(null);
  };

  const currentQuestion = questions.find(q => q.id === step);

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Statistical Test Selector</h1>
          <p className="text-muted-foreground">
            Find the right statistical test for your research data
          </p>
        </div>

        {!recommendation ? (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Question {step + 1}</CardTitle>
                  <CardDescription className="mt-2">
                    {currentQuestion?.question}
                  </CardDescription>
                </div>
                <FlaskRound className="h-8 w-8 text-primary" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <RadioGroup
                value={answers[step] || ""}
                onValueChange={handleAnswer}
              >
                {currentQuestion?.options.map((option) => (
                  <div key={option.value} className="flex items-start space-x-3 p-4 rounded-lg border hover:bg-accent cursor-pointer">
                    <RadioGroupItem value={option.value} id={option.value} />
                    <Label htmlFor={option.value} className="cursor-pointer flex-1">
                      {option.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>

              {step > 0 && (
                <Button variant="outline" onClick={handleBack}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Previous Question
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <Card className="border-primary">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-8 w-8 text-primary" />
                  <div>
                    <CardTitle className="text-2xl">{recommendation.name}</CardTitle>
                    <CardDescription className="mt-2">
                      Recommended statistical test for your data
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{recommendation.description}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Assumptions</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {recommendation.assumptions.map((assumption, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>{assumption}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Example Use Case</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{recommendation.example}</p>
              </CardContent>
            </Card>

            <div className="flex gap-4">
              <Button onClick={handleReset} variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Start Over
              </Button>
              {recommendation.sampleSizeLink && (
                <Link href={recommendation.sampleSizeLink}>
                  <Button>
                    Calculate Sample Size
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
