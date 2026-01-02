import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { Loader2, Plus, FolderOpen } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";
import { toast } from "sonner";

export default function Projects() {
  const { user, isAuthenticated } = useAuth();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [studyType, setStudyType] = useState("");

  const { data: projects, isLoading } = trpc.projects.list.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const utils = trpc.useUtils();
  const createMutation = trpc.projects.create.useMutation({
    onSuccess: () => {
      utils.projects.list.invalidate();
      setIsCreateDialogOpen(false);
      setTitle("");
      setDescription("");
      setStudyType("");
      toast.success("Project created successfully");
    },
    onError: (error) => {
      toast.error("Failed to create project: " + error.message);
    },
  });

  const handleCreate = () => {
    if (!title.trim()) {
      toast.error("Please enter a project title");
      return;
    }
    createMutation.mutate({ title, description, studyType });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>
              Please log in to access your research projects.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Research Projects</h1>
            <p className="text-muted-foreground mt-2">
              Manage your research projects and proposals
            </p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Project
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Project</DialogTitle>
                <DialogDescription>
                  Start a new research project to organize your work
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Project Title</Label>
                  <Input
                    id="title"
                    placeholder="Enter project title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Brief description of your research"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="studyType">Study Type (Optional)</Label>
                  <Select value={studyType} onValueChange={setStudyType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select study type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rct">Randomized Controlled Trial</SelectItem>
                      <SelectItem value="observational">Observational Study</SelectItem>
                      <SelectItem value="cohort">Cohort Study</SelectItem>
                      <SelectItem value="case-control">Case-Control Study</SelectItem>
                      <SelectItem value="cross-sectional">Cross-Sectional Study</SelectItem>
                      <SelectItem value="systematic-review">Systematic Review</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleCreate} disabled={createMutation.isPending}>
                  {createMutation.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Create Project
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : projects && projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Link key={project.id} href={`/project/${project.id}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <FolderOpen className="h-8 w-8 text-primary mb-2" />
                      <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                        {project.status}
                      </span>
                    </div>
                    <CardTitle className="line-clamp-2">{project.title}</CardTitle>
                    {project.studyType && (
                      <CardDescription className="text-xs">
                        {project.studyType}
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    {project.description && (
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {project.description}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground mt-4">
                      Updated {new Date(project.updatedAt).toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FolderOpen className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No projects yet</h3>
              <p className="text-muted-foreground text-center mb-4">
                Create your first research project to get started
              </p>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create Project
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
