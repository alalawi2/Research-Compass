import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { DollarSign, Loader2, Plus, Save, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface BudgetCategory {
  name: string;
  amount: number;
}

const defaultCategories: BudgetCategory[] = [
  { name: "Personnel Costs", amount: 0 },
  { name: "Equipment", amount: 0 },
  { name: "Supplies & Materials", amount: 0 },
  { name: "Data Analysis", amount: 0 },
  { name: "GPU Hosting Venue", amount: 0 },
  { name: "Travel & Conference", amount: 0 },
  { name: "Publication Fees", amount: 0 },
  { name: "Other Costs", amount: 0 },
];

export default function BudgetCalculator() {
  const { isAuthenticated } = useAuth();
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [categories, setCategories] = useState<BudgetCategory[]>(defaultCategories);
  const [currency, setCurrency] = useState("USD");
  const [notes, setNotes] = useState("");

  const { data: projects } = trpc.projects.list.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const { data: existingBudget } = trpc.budget.getProjectBudget.useQuery(
    { projectId: selectedProjectId! },
    { enabled: selectedProjectId !== null }
  );

  const createBudgetMutation = trpc.budget.create.useMutation({
    onSuccess: () => {
      toast.success("Budget saved successfully");
    },
    onError: (error) => {
      toast.error("Failed to save budget: " + error.message);
    },
  });

  useEffect(() => {
    if (existingBudget) {
      try {
        const parsedCategories = JSON.parse(existingBudget.categories);
        setCategories(parsedCategories);
        setCurrency(existingBudget.currency || "USD");
        setNotes(existingBudget.notes || "");
      } catch (e) {
        console.error("Failed to parse budget categories");
      }
    }
  }, [existingBudget]);

  const totalBudget = categories.reduce((sum, cat) => sum + cat.amount, 0);

  const handleCategoryChange = (index: number, field: "name" | "amount", value: string | number) => {
    const newCategories = [...categories];
    if (field === "amount") {
      newCategories[index].amount = typeof value === "number" ? value : parseFloat(value) || 0;
    } else {
      newCategories[index].name = value as string;
    }
    setCategories(newCategories);
  };

  const handleAddCategory = () => {
    setCategories([...categories, { name: "", amount: 0 }]);
  };

  const handleRemoveCategory = (index: number) => {
    setCategories(categories.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    if (!selectedProjectId) {
      toast.error("Please select a project");
      return;
    }

    createBudgetMutation.mutate({
      projectId: selectedProjectId,
      categories: JSON.stringify(categories),
      totalAmount: Math.round(totalBudget),
      currency,
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
              Please log in to use the Budget Calculator.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8 max-w-5xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Budget Calculator</h1>
          <p className="text-muted-foreground">
            Estimate research costs and create detailed budget breakdowns
          </p>
        </div>

        {/* Project Selection */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Select Project</CardTitle>
          </CardHeader>
          <CardContent>
            {projects && projects.length > 0 ? (
              <Select
                value={selectedProjectId?.toString() || ""}
                onValueChange={(value) => setSelectedProjectId(parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose a project" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id.toString()}>
                      {project.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <p className="text-muted-foreground">
                No projects found. Create a project first.
              </p>
            )}
          </CardContent>
        </Card>

        {selectedProjectId && (
          <>
            {/* Budget Categories */}
            <Card className="mb-6">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Budget Categories</CardTitle>
                    <CardDescription>
                      Add and customize budget categories for your research
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Label htmlFor="currency">Currency:</Label>
                    <Select value={currency} onValueChange={setCurrency}>
                      <SelectTrigger id="currency" className="w-24">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="EUR">EUR</SelectItem>
                        <SelectItem value="GBP">GBP</SelectItem>
                        <SelectItem value="OMR">OMR</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {categories.map((category, index) => (
                    <div key={index} className="flex gap-4 items-start">
                      <div className="flex-1">
                        <Input
                          placeholder="Category name"
                          value={category.name}
                          onChange={(e) =>
                            handleCategoryChange(index, "name", e.target.value)
                          }
                        />
                      </div>
                      <div className="w-48">
                        <Input
                          type="number"
                          placeholder="Amount"
                          value={category.amount || ""}
                          onChange={(e) =>
                            handleCategoryChange(index, "amount", e.target.value)
                          }
                          min="0"
                          step="0.01"
                        />
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveCategory(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}

                  <Button
                    variant="outline"
                    onClick={handleAddCategory}
                    className="w-full"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Category
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Total Budget */}
            <Card className="mb-6 border-primary">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-6 w-6" />
                  Total Budget
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">
                  {currency} {totalBudget.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Sum of all budget categories
                </p>
              </CardContent>
            </Card>

            {/* Notes */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Add any additional notes about the budget..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                />
              </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex justify-end">
              <Button
                size="lg"
                onClick={handleSave}
                disabled={createBudgetMutation.isPending}
              >
                {createBudgetMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Budget
                  </>
                )}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
