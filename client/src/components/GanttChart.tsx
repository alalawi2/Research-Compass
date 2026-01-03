import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Milestone {
  name: string;
  startDate: string;
  endDate: string;
  status: string;
  description: string;
}

interface GanttChartProps {
  milestones: Milestone[];
  projectStartDate?: string;
  projectEndDate?: string;
}

export function GanttChart({ milestones, projectStartDate, projectEndDate }: GanttChartProps) {
  if (milestones.length === 0) {
    return null;
  }

  // Calculate project timeline bounds
  const allDates = milestones.flatMap(m => [new Date(m.startDate), new Date(m.endDate)]);
  const minDate = projectStartDate ? new Date(projectStartDate) : new Date(Math.min(...allDates.map(d => d.getTime())));
  const maxDate = projectEndDate ? new Date(projectEndDate) : new Date(Math.max(...allDates.map(d => d.getTime())));
  
  const totalDays = Math.ceil((maxDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24));

  const getPosition = (date: Date) => {
    const days = Math.ceil((date.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24));
    return (days / totalDays) * 100;
  };

  const getWidth = (start: Date, end: Date) => {
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(2, (days / totalDays) * 100);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-500';
      case 'in-progress':
        return 'bg-blue-500';
      case 'pending':
        return 'bg-gray-400';
      case 'delayed':
        return 'bg-red-500';
      default:
        return 'bg-gray-400';
    }
  };

  const getStatusBadgeVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'default';
      case 'in-progress':
        return 'secondary';
      case 'delayed':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  // Generate month markers
  const generateMonthMarkers = () => {
    const markers = [];
    const current = new Date(minDate);
    current.setDate(1);

    while (current <= maxDate) {
      const position = getPosition(current);
      if (position >= 0 && position <= 100) {
        markers.push({
          date: new Date(current),
          position,
          label: current.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        });
      }
      current.setMonth(current.getMonth() + 1);
    }

    return markers;
  };

  const monthMarkers = generateMonthMarkers();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Timeline (Gantt Chart)</CardTitle>
        <CardDescription>
          Visual representation of project milestones and their durations
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Timeline Header */}
        <div className="mb-6 p-4 bg-muted rounded-lg">
          <div className="flex justify-between text-sm">
            <div>
              <span className="text-muted-foreground">Project Start: </span>
              <span className="font-semibold">{minDate.toLocaleDateString()}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Project End: </span>
              <span className="font-semibold">{maxDate.toLocaleDateString()}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Duration: </span>
              <span className="font-semibold">{totalDays} days</span>
            </div>
          </div>
        </div>

        {/* Gantt Chart */}
        <div className="space-y-4">
          {/* Month markers */}
          <div className="relative h-8 border-b">
            {monthMarkers.map((marker, idx) => (
              <div
                key={idx}
                className="absolute top-0 text-xs text-muted-foreground"
                style={{ left: `${marker.position}%` }}
              >
                <div className="border-l border-muted-foreground/30 h-8"></div>
                <div className="mt-1 -translate-x-1/2">{marker.label}</div>
              </div>
            ))}
          </div>

          {/* Milestones */}
          {milestones.map((milestone, idx) => {
            const start = new Date(milestone.startDate);
            const end = new Date(milestone.endDate);
            const left = getPosition(start);
            const width = getWidth(start, end);

            return (
              <div key={idx} className="relative">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-48 text-sm font-medium truncate" title={milestone.name}>
                    {milestone.name}
                  </div>
                  <Badge variant={getStatusBadgeVariant(milestone.status)}>
                    {milestone.status}
                  </Badge>
                </div>
                
                <div className="relative h-10 bg-muted/30 rounded">
                  <div
                    className={`absolute h-full rounded ${getStatusColor(milestone.status)} transition-all`}
                    style={{
                      left: `${left}%`,
                      width: `${width}%`,
                    }}
                    title={`${milestone.name}: ${start.toLocaleDateString()} - ${end.toLocaleDateString()}`}
                  >
                    <div className="flex items-center justify-center h-full text-xs text-white font-medium px-2">
                      {width > 15 && milestone.name.substring(0, 20)}
                    </div>
                  </div>
                </div>

                {milestone.description && (
                  <div className="mt-1 text-xs text-muted-foreground pl-48">
                    {milestone.description}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-6 flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-green-500"></div>
            <span>Completed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-blue-500"></div>
            <span>In Progress</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-gray-400"></div>
            <span>Pending</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-red-500"></div>
            <span>Delayed</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
