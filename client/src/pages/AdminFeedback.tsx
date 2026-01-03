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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { StarRating } from "@/components/StarRating";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, Download } from "lucide-react";
import { Link } from "wouter";
import { format } from "date-fns";

export default function AdminFeedback() {
  const { user, isAuthenticated } = useAuth();
  const { data: feedback, isLoading } = trpc.feedback.getAll.useQuery();

  // Only admins can access this page
  if (!isAuthenticated || user?.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>
              You don't have permission to view this page.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Go Home
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const exportToCSV = () => {
    if (!feedback || feedback.length === 0) return;

    const headers = ["Date", "Type", "Subject", "Rating", "Message", "User", "Status"];
    const rows = feedback.map((item) => [
      format(new Date(item.createdAt), "yyyy-MM-dd HH:mm"),
      item.type,
      item.subject,
      extractRating(item.message),
      item.message.replace(/Rating: \d\/5 stars\n\n/, ""),
      item.userName || "Unknown",
      item.status || "new",
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `feedback-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const extractRating = (message: string): number => {
    const match = message.match(/Rating: (\d)\/5 stars/);
    return match ? parseInt(match[1]) : 0;
  };

  const getTypeBadge = (type: string) => {
    const variants: Record<string, { variant: "default" | "destructive" | "secondary" | "outline"; label: string }> = {
      bug: { variant: "destructive", label: "🐛 Bug" },
      feature: { variant: "default", label: "✨ Feature" },
      feedback: { variant: "secondary", label: "💬 Feedback" },
      question: { variant: "outline", label: "❓ Question" },
    };
    const config = variants[type] || variants.feedback;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Feedback Dashboard</h1>
            <p className="text-muted-foreground">
              View and manage user feedback submissions
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={exportToCSV} disabled={!feedback || feedback.length === 0}>
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
            <Button variant="outline" asChild>
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Feedback</CardTitle>
            <CardDescription>
              {feedback?.length || 0} total submissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">
                Loading feedback...
              </div>
            ) : !feedback || feedback.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No feedback submissions yet
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Message</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {feedback.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="whitespace-nowrap">
                          {format(new Date(item.createdAt), "MMM d, yyyy")}
                        </TableCell>
                        <TableCell>{getTypeBadge(item.type)}</TableCell>
                        <TableCell className="font-medium max-w-xs truncate">
                          {item.subject}
                        </TableCell>
                        <TableCell>
                          <StarRating
                            value={extractRating(item.message)}
                            onChange={() => {}}
                            readonly
                          />
                        </TableCell>
                        <TableCell>{item.userName || "Unknown"}</TableCell>
                        <TableCell className="max-w-md">
                          <div className="text-sm text-muted-foreground line-clamp-2">
                            {item.message.replace(/Rating: \d\/5 stars\n\n/, "")}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
