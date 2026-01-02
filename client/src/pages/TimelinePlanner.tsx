import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { Calendar, Loader2, Plus, Save, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Milestone {
  name: string;
  startDate: string;
  endDate: string;
  status: "planned" | "in-progress" | "completed" | "delayed";
  description: string;
}

const defaultMilestones: Milestone[] = [
  {
    name: "Protocol Development",
    startDate: "",
    endDate: "",
    status: "planned",
    description: "Develop research protocol and obtain IRB approval",
  },
  {
    name: "Participant Recruitment",
    startDate: "",
    endDate: "",
    status: "planned",
    description: "Recruit and screen study participants",
  },
  {
    name: "Data Collection",
    startDate: "",
    endDate: "",
    status: "planned",
    description: "Collect data from participants",
  },
  {
    name: "Data Analysis",
    startDate: "",
    endDate: "",
    status: "planned",
    description: "Analyze collected data and generate results",
  },
  {
    name: "Manuscript Writing",
    startDate: "",
    endDate: "",
    status: "planned",
    description: "Write and submit manuscript for publication",
  },
];

export default function TimelinePlanner() {
  const { isAuthenticated } = useAuth();
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [milestones, setMilestones] = useState<Milestone[]>(defaultMilestones);
  const [projectStartDate, setProjectStartDate] = useState("");
  const [projectEndDate, setProjectEndDate] = useState("");

  const { data: projects } = trpc.projects.list.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const { data: existingTimeline } = trpc.timeline.getProjectTimeline.useQuery(
    { projectId: selectedProjectId! },
    { enabled: selectedProjectId !== null }
  );

  const createTimelineMutation = trpc.timeline.create.useMutation({
    onSuccess: () => {
      toast.success("Timeline saved successfully");
    },
    onError: (error) => {
      toast.error("Failed to save timeline: " + error.message);
    },
  });

  useEffect(() => {
    if (existingTimeline && existingTimeline.length > 0) {
      const timeline = existingTimeline[0];
      try {
        const parsedMilestones = JSON.parse(timeline.milestones);
        setMilestones(parsedMilestones);
        if (timeline.startDate) {
          setProjectStartDate(new Date(timeline.startDate).toISOString().split("T")[0]);
        }
        if (timeline.endDate) {
          setProjectEndDate(new Date(timeline.endDate).toISOString().split("T")[0]);
        }
      } catch (e) {
        console.error("Failed to parse timeline milestones");
      }
    }
  }, [existingTimeline]);

  const handleMilestoneChange = (
    index: number,
    field: keyof Milestone,
    value: string
  ) => {
    const newMilestones = [...milestones];
    newMilestones[index] = { ...newMilestones[index], [field]: value };
    setMilestones(newMilestones);
  };

  const handleAddMilestone = () => {
    setMilestones([
      ...milestones,
      {
        name: "",
        startDate: "",
        endDate: "",
        status: "planned",
        description: "",
      },
    ]);
  };

  const handleRemoveMilestone = (index: number) => {
    setMilestones(milestones.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    if (!selectedProjectId) {
      toast.error("Please select a project");
      return;
    }

    createTimelineMutation.mutate({
      projectId: selectedProjectId,
      milestones: JSON.stringify(milestones),
      startDate: projectStartDate ? new Date(projectStartDate) : undefined,
      endDate: projectEndDate ? new Date(projectEndDate) : undefined,
    });
  };

  const getStatusColor = (status: Milestone["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-500";
      case "in-progress":
        return "bg-blue-500";
      case "delayed":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>
              Please log in to use the Timeline Planner.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Timeline Planner</h1>
          <p className="text-muted-foreground">
            Plan and track research milestones and project timelines
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
            {/* Project Dates */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Project Duration</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startDate">Project Start Date</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={projectStartDate}
                      onChange={(e) => setProjectStartDate(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="endDate">Project End Date</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={projectEndDate}
                      onChange={(e) => setProjectEndDate(e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Milestones */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Research Milestones</CardTitle>
                <CardDescription>
                  Define key milestones and track their progress
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {milestones.map((milestone, index) => (
                    <div key={index} className="p-4 border rounded-lg space-y-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-4">
                          <div>
                            <Label>Milestone Name</Label>
                            <Input
                              placeholder="e.g., IRB Approval, Data Collection"
                              value={milestone.name}
                              onChange={(e) =>
                                handleMilestoneChange(index, "name", e.target.value)
                              }
                            />
                          </div>

                          <div>
                            <Label>Description</Label>
                            <Input
                              placeholder="Brief description of this milestone"
                              value={milestone.description}
                              onChange={(e) =>
                                handleMilestoneChange(index, "description", e.target.value)
                              }
                            />
                          </div>

                          <div className="grid grid-cols-3 gap-4">
                            <div>
                              <Label>Start Date</Label>
                              <Input
                                type="date"
                                value={milestone.startDate}
                                onChange={(e) =>
                                  handleMilestoneChange(index, "startDate", e.target.value)
                                }
                              />
                            </div>
                            <div>
                              <Label>End Date</Label>
                              <Input
                                type="date"
                                value={milestone.endDate}
                                onChange={(e) =>
                                  handleMilestoneChange(index, "endDate", e.target.value)
                                }
                              />
                            </div>
                            <div>
                              <Label>Status</Label>
                              <Select
                                value={milestone.status}
                                onValueChange={(value) =>
                                  handleMilestoneChange(
                                    index,
                                    "status",
                                    value as Milestone["status"]
                                  )
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="planned">Planned</SelectItem>
                                  <SelectItem value="in-progress">In Progress</SelectItem>
                                  <SelectItem value="completed">Completed</SelectItem>
                                  <SelectItem value="delayed">Delayed</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2">
                          <div
                            className={`w-3 h-3 rounded-full ${getStatusColor(
                              milestone.status
                            )}`}
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveMilestone(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}

                  <Button
                    variant="outline"
                    onClick={handleAddMilestone}
                    className="w-full"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Milestone
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Timeline Visualization */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Timeline Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {milestones
                    .filter((m) => m.name && m.startDate && m.endDate)
                    .map((milestone, index) => (
                      <div key={index} className="flex items-center gap-4">
                        <div className="w-48 font-medium text-sm truncate">
                          {milestone.name}
                        </div>
                        <div className="flex-1 bg-muted rounded-full h-8 relative overflow-hidden">
                          <div
                            className={`absolute inset-y-0 left-0 ${getStatusColor(
                              milestone.status
                            )} opacity-70 flex items-center px-3 text-xs text-white font-medium`}
                            style={{ width: "100%" }}
                          >
                            {milestone.startDate} → {milestone.endDate}
                          </div>
                        </div>
                        <div className="w-24 text-sm text-muted-foreground capitalize">
                          {milestone.status}
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex justify-end">
              <Button
                size="lg"
                onClick={handleSave}
                disabled={createTimelineMutation.isPending}
              >
                {createTimelineMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Timeline
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
