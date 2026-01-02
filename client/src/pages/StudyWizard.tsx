import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ArrowLeft, ArrowRight, CheckCircle2, FlaskConical } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

interface StudyRecommendation {
  type: string;
  title: string;
  description: string;
  pros: string[];
  cons: string[];
  examples: string[];
  irbConsiderations: string[];
}

const studyTypes: Record<string, StudyRecommendation> = {
  rct: {
    type: "rct",
    title: "Randomized Controlled Trial (RCT)",
    description: "Participants are randomly assigned to intervention or control groups. The gold standard for establishing causality.",
    pros: [
      "Strongest evidence for causality",
      "Minimizes selection bias",
      "Controls for confounding variables",
      "Allows for blinding"
    ],
    cons: [
      "Expensive and time-consuming",
      "May have ethical constraints",
      "Recruitment challenges",
      "May lack external validity"
    ],
    examples: [
      "Testing a new drug vs placebo",
      "Comparing two surgical techniques",
      "Evaluating behavioral interventions"
    ],
    irbConsiderations: [
      "Informed consent required",
      "Randomization justification",
      "Safety monitoring plan",
      "Data and safety monitoring board may be needed"
    ]
  },
  cohort: {
    type: "cohort",
    title: "Cohort Study",
    description: "Follow groups with and without exposure over time to observe outcomes. Can be prospective or retrospective.",
    pros: [
      "Can study multiple outcomes",
      "Establishes temporal relationship",
      "Less expensive than RCT",
      "Good for rare exposures"
    ],
    cons: [
      "Time-consuming for prospective studies",
      "Loss to follow-up",
      "Cannot prove causation",
      "Confounding variables"
    ],
    examples: [
      "Following smokers vs non-smokers for lung cancer",
      "Tracking medication adherence and outcomes",
      "Monitoring occupational exposures"
    ],
    irbConsiderations: [
      "Informed consent for prospective studies",
      "Privacy protection for medical records",
      "Data security measures",
      "Long-term participant contact plan"
    ]
  },
  caseControl: {
    type: "case-control",
    title: "Case-Control Study",
    description: "Compare individuals with a condition (cases) to those without (controls), looking back at exposures.",
    pros: [
      "Efficient for rare diseases",
      "Relatively quick and inexpensive",
      "Can study multiple exposures",
      "Requires fewer participants"
    ],
    cons: [
      "Recall bias",
      "Selection bias in controls",
      "Cannot calculate incidence",
      "Temporal relationship unclear"
    ],
    examples: [
      "Comparing cancer patients to healthy controls",
      "Investigating risk factors for rare diseases",
      "Studying outbreak causes"
    ],
    irbConsiderations: [
      "Informed consent from cases and controls",
      "Matching criteria justification",
      "Privacy protection",
      "Sensitive data handling"
    ]
  },
  crossSectional: {
    type: "cross-sectional",
    title: "Cross-Sectional Study",
    description: "Observe exposure and outcome at a single point in time. Provides a snapshot of a population.",
    pros: [
      "Quick and inexpensive",
      "Good for prevalence studies",
      "Can study multiple outcomes",
      "Useful for hypothesis generation"
    ],
    cons: [
      "Cannot establish causality",
      "No temporal relationship",
      "Survivor bias",
      "Cannot study rare conditions"
    ],
    examples: [
      "Survey of disease prevalence",
      "Assessing health behaviors",
      "Quality of life assessments"
    ],
    irbConsiderations: [
      "Informed consent for surveys",
      "Anonymity protection",
      "Minimal risk determination",
      "Data storage and security"
    ]
  },
  systematicReview: {
    type: "systematic-review",
    title: "Systematic Review / Meta-Analysis",
    description: "Comprehensive synthesis of existing research on a specific question using rigorous methodology.",
    pros: [
      "Highest level of evidence",
      "Comprehensive literature coverage",
      "Identifies research gaps",
      "Cost-effective"
    ],
    cons: [
      "Dependent on quality of existing studies",
      "Publication bias",
      "Time-consuming",
      "Heterogeneity challenges"
    ],
    examples: [
      "Effectiveness of treatment interventions",
      "Diagnostic test accuracy",
      "Risk factor associations"
    ],
    irbConsiderations: [
      "Usually exempt from IRB",
      "Protocol registration (PROSPERO)",
      "Transparent reporting (PRISMA)",
      "Conflict of interest disclosure"
    ]
  }
};

export default function StudyWizard() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [recommendation, setRecommendation] = useState<StudyRecommendation | null>(null);

  const questions = [
    {
      id: 0,
      question: "What is your primary research objective?",
      options: [
        { value: "causality", label: "Establish cause-and-effect relationship (test intervention)" },
        { value: "association", label: "Identify associations or risk factors" },
        { value: "prevalence", label: "Measure prevalence or describe population" },
        { value: "synthesis", label: "Synthesize existing research" }
      ]
    },
    {
      id: 1,
      question: "Can you randomly assign participants to groups?",
      options: [
        { value: "yes", label: "Yes, randomization is feasible and ethical" },
        { value: "no", label: "No, randomization is not feasible or ethical" }
      ],
      showIf: (ans: Record<number, string>) => ans[0] === "causality"
    },
    {
      id: 2,
      question: "What is your time frame and budget?",
      options: [
        { value: "long", label: "Long-term with substantial budget" },
        { value: "moderate", label: "Moderate time and budget" },
        { value: "short", label: "Limited time and budget" }
      ],
      showIf: (ans: Record<number, string>) => ans[0] === "association"
    },
    {
      id: 3,
      question: "Is the outcome you're studying rare?",
      options: [
        { value: "yes", label: "Yes, the outcome is rare" },
        { value: "no", label: "No, the outcome is common" }
      ],
      showIf: (ans: Record<number, string>) => ans[0] === "association" && ans[2] === "short"
    },
    {
      id: 4,
      question: "Do you want to follow participants over time?",
      options: [
        { value: "yes", label: "Yes, prospective follow-up" },
        { value: "no", label: "No, single time point assessment" }
      ],
      showIf: (ans: Record<number, string>) => ans[0] === "association" && (ans[2] === "long" || ans[2] === "moderate")
    }
  ];

  const determineRecommendation = (ans: Record<number, string>): StudyRecommendation => {
    // Synthesis path
    if (ans[0] === "synthesis") {
      return studyTypes.systematicReview;
    }

    // Prevalence/descriptive path
    if (ans[0] === "prevalence") {
      return studyTypes.crossSectional;
    }

    // Causality path
    if (ans[0] === "causality") {
      if (ans[1] === "yes") {
        return studyTypes.rct;
      } else {
        return studyTypes.cohort;
      }
    }

    // Association path
    if (ans[0] === "association") {
      if (ans[2] === "short") {
        if (ans[3] === "yes") {
          return studyTypes.caseControl;
        } else {
          return studyTypes.crossSectional;
        }
      } else {
        if (ans[4] === "yes") {
          return studyTypes.cohort;
        } else {
          return studyTypes.crossSectional;
        }
      }
    }

    return studyTypes.crossSectional;
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
      setRecommendation(determineRecommendation(newAnswers));
    } else {
      // Move to next question
      setStep(nextQuestions[0].id);
    }
  };

  const handleBack = () => {
    // Find previous question
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
          <h1 className="text-3xl font-bold mb-2">Study Type Wizard</h1>
          <p className="text-muted-foreground">
            Answer a few questions to find the best study design for your research
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
                <FlaskConical className="h-8 w-8 text-primary" />
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
                    <CardTitle className="text-2xl">{recommendation.title}</CardTitle>
                    <CardDescription className="mt-2">
                      Recommended study design based on your answers
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{recommendation.description}</p>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Advantages</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {recommendation.pros.map((pro, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>{pro}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Limitations</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {recommendation.cons.map((con, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="text-orange-600 mt-0.5">⚠</span>
                        <span>{con}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Example Applications</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {recommendation.examples.map((example, idx) => (
                    <li key={idx} className="text-sm text-muted-foreground">
                      • {example}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">IRB/Ethics Considerations</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {recommendation.irbConsiderations.map((consideration, idx) => (
                    <li key={idx} className="text-sm text-muted-foreground">
                      • {consideration}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <div className="flex gap-4">
              <Button onClick={handleReset} variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Start Over
              </Button>
              <Link href="/tools/sample-size">
                <Button>
                  Calculate Sample Size
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
