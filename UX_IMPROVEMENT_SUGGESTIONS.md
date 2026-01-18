# UX Improvement & Redundancy Reduction Suggestions

## Executive Summary

After analyzing the Research-Compass codebase, I've identified **23 improvement opportunities** across UX, code redundancy, and architecture. This document provides prioritized, actionable recommendations.

---

## Priority Matrix

| Priority | Impact | Effort | Items |
|----------|--------|--------|-------|
| **P0** | High | Low | 5 items - Quick wins |
| **P1** | High | Medium | 6 items - Major improvements |
| **P2** | Medium | Low | 7 items - Polish |
| **P3** | Low | Low | 5 items - Nice to have |

---

## P0: Quick Wins (High Impact, Low Effort)

### 1. Create `<ProtectedPage>` Wrapper Component

**Problem:** 6 pages duplicate identical authentication check code (15-20 lines each).

**Current Pattern (repeated in 6 files):**
```tsx
// BudgetCalculator.tsx, TimelinePlanner.tsx, LiteratureSearch.tsx, etc.
if (!isAuthenticated) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card>
        <CardHeader>
          <CardTitle>Authentication Required</CardTitle>
          <CardDescription>Please log in to use the Budget Calculator.</CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
```

**Solution:** Create a reusable wrapper component.

```tsx
// client/src/components/ProtectedPage.tsx
interface ProtectedPageProps {
  children: React.ReactNode;
  title: string;
  description?: string;
}

export function ProtectedPage({ children, title, description }: ProtectedPageProps) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <PageSkeleton />;
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>
              Please log in to use {title}.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" onClick={() => window.location.href = '/api/login'}>
              Sign In to Continue
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
```

**Usage:**
```tsx
// BudgetCalculator.tsx - Before: 120 lines, After: 105 lines
export default function BudgetCalculator() {
  return (
    <ProtectedPage title="Budget Calculator">
      {/* Page content */}
    </ProtectedPage>
  );
}
```

**Impact:** Removes ~90 lines of duplicated code, adds sign-in button for better UX.

---

### 2. Create `<ProjectSelector>` Component

**Problem:** 4 pages have identical project selection dropdown (20+ lines each).

**Files affected:**
- `BudgetCalculator.tsx` (lines 130-157)
- `TimelinePlanner.tsx` (lines 182-210)
- `LiteratureSearch.tsx` (lines 327-345)
- `SampleSizeCalculator.tsx` (missing - should have it)

**Solution:**
```tsx
// client/src/components/ProjectSelector.tsx
interface ProjectSelectorProps {
  value: number | null;
  onChange: (projectId: number | null) => void;
  placeholder?: string;
  emptyMessage?: string;
}

export function ProjectSelector({
  value,
  onChange,
  placeholder = "Choose a project",
  emptyMessage = "No projects found. Create a project first."
}: ProjectSelectorProps) {
  const { data: projects, isLoading } = trpc.projects.list.useQuery();

  if (isLoading) {
    return <Skeleton className="h-10 w-full" />;
  }

  if (!projects?.length) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground">
        <AlertCircle className="h-4 w-4" />
        <span>{emptyMessage}</span>
        <Link to="/projects" className="text-primary hover:underline">
          Create one
        </Link>
      </div>
    );
  }

  return (
    <Select
      value={value?.toString() || ""}
      onValueChange={(v) => onChange(v ? parseInt(v) : null)}
    >
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {projects.map((project) => (
          <SelectItem key={project.id} value={project.id.toString()}>
            {project.title}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
```

**Impact:** Removes ~80 lines of duplicated code, adds loading state and helpful empty message.

---

### 3. Create `useArrayState` Hook

**Problem:** Add/remove item pattern repeated 5+ times with identical logic.

**Current pattern (repeated):**
```tsx
const handleAddItem = () => {
  setItems([...items, newItem]);
  setNewItem(defaultItem);
};

const handleRemoveItem = (index: number) => {
  setItems(items.filter((_, i) => i !== index));
};

const handleUpdateItem = (index: number, updates: Partial<Item>) => {
  setItems(items.map((item, i) => i === index ? { ...item, ...updates } : item));
};
```

**Solution:**
```tsx
// client/src/hooks/useArrayState.ts
export function useArrayState<T>(initialItems: T[] = []) {
  const [items, setItems] = useState<T[]>(initialItems);

  const addItem = useCallback((item: T) => {
    setItems(prev => [...prev, item]);
  }, []);

  const removeItem = useCallback((index: number) => {
    setItems(prev => prev.filter((_, i) => i !== index));
  }, []);

  const updateItem = useCallback((index: number, updates: Partial<T>) => {
    setItems(prev => prev.map((item, i) =>
      i === index ? { ...item, ...updates } : item
    ));
  }, []);

  const moveItem = useCallback((fromIndex: number, toIndex: number) => {
    setItems(prev => {
      const result = [...prev];
      const [removed] = result.splice(fromIndex, 1);
      result.splice(toIndex, 0, removed);
      return result;
    });
  }, []);

  return { items, setItems, addItem, removeItem, updateItem, moveItem };
}
```

**Usage:**
```tsx
// Before: 15 lines
const [themes, setThemes] = useState([]);
const handleAddTheme = () => { /* ... */ };
const handleRemoveTheme = (index) => { /* ... */ };

// After: 1 line
const { items: themes, addItem: addTheme, removeItem: removeTheme } = useArrayState([]);
```

**Impact:** Removes ~75 lines across 5 files, adds reorder capability for free.

---

### 4. Create `<ExportButtons>` Component

**Problem:** Export PDF/Word buttons duplicated across 3 pages with same structure.

**Solution:**
```tsx
// client/src/components/ExportButtons.tsx
interface ExportButtonsProps {
  onExportPDF: () => void | Promise<void>;
  onExportWord?: () => void | Promise<void>;
  pdfLabel?: string;
  wordLabel?: string;
}

export function ExportButtons({
  onExportPDF,
  onExportWord,
  pdfLabel = "Export PDF",
  wordLabel = "Export Word"
}: ExportButtonsProps) {
  const [isExporting, setIsExporting] = useState<'pdf' | 'word' | null>(null);

  const handleExport = async (type: 'pdf' | 'word', fn: () => void | Promise<void>) => {
    setIsExporting(type);
    try {
      await fn();
      toast.success(`${type.toUpperCase()} exported successfully`);
    } catch (error) {
      toast.error(`Failed to export ${type.toUpperCase()}`);
    } finally {
      setIsExporting(null);
    }
  };

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        onClick={() => handleExport('pdf', onExportPDF)}
        disabled={isExporting !== null}
      >
        {isExporting === 'pdf' ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Download className="mr-2 h-4 w-4" />
        )}
        {pdfLabel}
      </Button>

      {onExportWord && (
        <Button
          variant="outline"
          onClick={() => handleExport('word', onExportWord)}
          disabled={isExporting !== null}
        >
          {isExporting === 'word' ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <FileText className="mr-2 h-4 w-4" />
          )}
          {wordLabel}
        </Button>
      )}
    </div>
  );
}
```

**Impact:** Removes ~45 lines of duplicated code, adds loading states and error handling.

---

### 5. Create `<PhaseHeader>` Component

**Problem:** Workflow phases use identical gradient card header pattern.

**Solution:**
```tsx
// client/src/components/workflow/PhaseHeader.tsx
interface PhaseHeaderProps {
  icon: LucideIcon;
  title: string;
  description: string;
  color: 'blue' | 'purple' | 'amber' | 'green' | 'rose';
}

const colorClasses = {
  blue: 'from-blue-50 to-blue-50 dark:from-blue-950 dark:to-blue-950 border-blue-200 dark:border-blue-800 bg-blue-600',
  purple: 'from-purple-50 to-purple-50 dark:from-purple-950 dark:to-purple-950 border-purple-200 dark:border-purple-800 bg-purple-600',
  amber: 'from-amber-50 to-amber-50 dark:from-amber-950 dark:to-amber-950 border-amber-200 dark:border-amber-800 bg-amber-600',
  green: 'from-green-50 to-green-50 dark:from-green-950 dark:to-green-950 border-green-200 dark:border-green-800 bg-green-600',
  rose: 'from-rose-50 to-rose-50 dark:from-rose-950 dark:to-rose-950 border-rose-200 dark:border-rose-800 bg-rose-600',
};

export function PhaseHeader({ icon: Icon, title, description, color }: PhaseHeaderProps) {
  const classes = colorClasses[color];

  return (
    <Card className={`p-6 bg-gradient-to-r ${classes.split(' ').slice(0, 4).join(' ')}`}>
      <div className="flex items-start gap-4">
        <div className={`w-10 h-10 rounded-full ${classes.split(' ').pop()} flex items-center justify-center flex-shrink-0`}>
          <Icon className="h-5 w-5 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-2">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
    </Card>
  );
}
```

**Impact:** Removes ~50 lines across workflow phases, ensures visual consistency.

---

## P1: Major Improvements (High Impact, Medium Effort)

### 6. Create Unified `<ToolPage>` Layout Component

**Problem:** BudgetCalculator, TimelinePlanner, and SampleSizeCalculator share identical structure:
1. Container with max-width
2. Header section
3. Project selection card
4. Main content (conditional on project)
5. Footer with actions

**Solution:**
```tsx
// client/src/components/ToolPage.tsx
interface ToolPageProps {
  title: string;
  description: string;
  icon: LucideIcon;
  requiresProject?: boolean;
  children: React.ReactNode | ((projectId: number) => React.ReactNode);
  actions?: React.ReactNode;
}

export function ToolPage({
  title,
  description,
  icon: Icon,
  requiresProject = true,
  children,
  actions
}: ToolPageProps) {
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);

  return (
    <ProtectedPage title={title}>
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <Icon className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{title}</h1>
            <p className="text-muted-foreground">{description}</p>
          </div>
        </div>

        {/* Project Selection */}
        {requiresProject && (
          <Card className="p-6 mb-6">
            <Label className="mb-2 block">Select Project</Label>
            <ProjectSelector
              value={selectedProjectId}
              onChange={setSelectedProjectId}
            />
          </Card>
        )}

        {/* Main Content */}
        {(!requiresProject || selectedProjectId) && (
          <div className="space-y-6">
            {typeof children === 'function'
              ? children(selectedProjectId!)
              : children
            }
          </div>
        )}

        {/* Actions */}
        {actions && (
          <div className="flex justify-end gap-2 mt-6 pt-6 border-t">
            {actions}
          </div>
        )}
      </div>
    </ProtectedPage>
  );
}
```

**Before (BudgetCalculator.tsx): ~330 lines**
**After: ~150 lines**

**Impact:** Reduces 3 pages by ~50% each, ensures consistent tool page UX.

---

### 7. Create `<WorkflowPhase>` Base Component

**Problem:** 5 workflow phases share 70% identical structure.

**Solution:**
```tsx
// client/src/components/workflow/WorkflowPhase.tsx
interface WorkflowPhaseProps<T> {
  data?: T;
  defaultData: T;
  onSave: (data: T) => void;
  onNext: () => void;
  header: {
    icon: LucideIcon;
    title: string;
    description: string;
    color: 'blue' | 'purple' | 'amber' | 'green' | 'rose';
  };
  nextLabel?: string;
  canProceed?: (data: T) => boolean;
  children: (props: {
    data: T;
    updateData: (updates: Partial<T>) => void;
    setData: React.Dispatch<React.SetStateAction<T>>;
  }) => React.ReactNode;
}

export function WorkflowPhase<T extends object>({
  data: initialData,
  defaultData,
  onSave,
  onNext,
  header,
  nextLabel = "Continue",
  canProceed = () => true,
  children
}: WorkflowPhaseProps<T>) {
  const [data, setData] = useState<T>(initialData || defaultData);

  const updateData = useCallback((updates: Partial<T>) => {
    setData(prev => ({ ...prev, ...updates }));
  }, []);

  const handleSave = () => onSave(data);

  const handleComplete = () => {
    handleSave();
    onNext();
  };

  return (
    <div className="space-y-6">
      <PhaseHeader {...header} />

      {children({ data, updateData, setData })}

      <div className="flex justify-between pt-4 border-t">
        <Button variant="outline" onClick={handleSave}>
          <Save className="mr-2 h-4 w-4" />
          Save Progress
        </Button>

        <Button onClick={handleComplete} disabled={!canProceed(data)}>
          {nextLabel}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
```

**Impact:** Reduces each phase component by ~40%, enforces consistent UX.

---

### 8. Clarify Primary User Journey

**Problem:** Home page presents 9 separate tools without clear guidance. Users don't know whether to use the Research Workflow or individual tools.

**Current Navigation Confusion:**
```
Home → 9 separate tool cards → User confusion
       ↓
       Research Workflow (contains some of the same tools)
```

**Solution: Restructure Home Page**

```tsx
// Suggested Home.tsx structure
<div className="space-y-12">
  {/* Hero: Primary CTA */}
  <section className="text-center">
    <h1>Research-Compass</h1>
    <p>Your AI-powered research assistant</p>
    <Button size="lg" asChild>
      <Link to="/research-workflow">
        Start Research Workflow
        <ArrowRight className="ml-2" />
      </Link>
    </Button>
  </section>

  {/* Workflow Overview */}
  <section>
    <h2>Complete Research Journey</h2>
    <p>Follow our 11-phase workflow from question to proposal</p>
    <WorkflowPreview /> {/* Visual showing the 11 phases */}
  </section>

  {/* Individual Tools - Secondary */}
  <section>
    <h2>Quick Tools</h2>
    <p>Jump directly to specific calculators and utilities</p>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {/* Smaller cards for individual tools */}
    </div>
  </section>
</div>
```

**Impact:** Reduces user confusion, establishes clear primary path.

---

### 9. Complete Unimplemented Workflow Phases

**Problem:** 5 phases show "Coming Soon" placeholders, breaking the user journey.

**Affected Phases:**
- Phase 3: Systematic Review
- Phase 6: Study Design
- Phase 8: Statistical Plan
- Phase 9: Methods
- Phase 10: Timeline & Ethics

**Minimum Viable Implementation:**

```tsx
// For each unimplemented phase, create at minimum:
export default function SystematicReviewPhase({ data, onSave, onNext }) {
  return (
    <WorkflowPhase
      data={data}
      defaultData={{ criteria: [], searchStrategy: '', prismaFlow: {} }}
      onSave={onSave}
      onNext={onNext}
      header={{
        icon: FileSearch,
        title: "Systematic Review",
        description: "Define inclusion criteria and search strategy",
        color: "blue"
      }}
    >
      {({ data, updateData }) => (
        <Card className="p-6">
          <div className="space-y-4">
            <div>
              <Label>Inclusion Criteria</Label>
              <Textarea
                value={data.criteria}
                onChange={(e) => updateData({ criteria: e.target.value })}
                placeholder="Define your inclusion/exclusion criteria..."
              />
            </div>
            <div>
              <Label>Search Strategy</Label>
              <Textarea
                value={data.searchStrategy}
                onChange={(e) => updateData({ searchStrategy: e.target.value })}
                placeholder="Describe your database search strategy..."
              />
            </div>
          </div>
        </Card>
      )}
    </WorkflowPhase>
  );
}
```

**Impact:** Users can complete full workflow, major UX improvement.

---

### 10. Add Global Loading States

**Problem:** Many async operations lack visual feedback.

**Solution: Create loading utilities**

```tsx
// client/src/components/LoadingButton.tsx
interface LoadingButtonProps extends ButtonProps {
  isLoading?: boolean;
  loadingText?: string;
}

export function LoadingButton({
  isLoading,
  loadingText,
  children,
  disabled,
  ...props
}: LoadingButtonProps) {
  return (
    <Button disabled={disabled || isLoading} {...props}>
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {loadingText || children}
        </>
      ) : children}
    </Button>
  );
}

// Usage with mutations
const mutation = trpc.proposals.generateOutline.useMutation();

<LoadingButton
  isLoading={mutation.isPending}
  loadingText="Generating..."
  onClick={() => mutation.mutate(data)}
>
  Generate Outline
</LoadingButton>
```

**Impact:** Users always know when operations are in progress.

---

### 11. Standardize Form Validation

**Problem:** Inconsistent validation - some pages validate client-side, others only on server error.

**Solution: Create validation schema utilities**

```tsx
// shared/validation.ts
import { z } from 'zod';

export const projectSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  description: z.string().optional(),
  studyType: z.enum(['observational', 'experimental', 'qualitative', 'mixed']),
});

export const sampleSizeSchema = z.object({
  testType: z.enum(['ttest', 'anova', 'chisquare', ...]),
  alpha: z.number().min(0.001).max(0.1),
  power: z.number().min(0.5).max(0.99),
  effectSize: z.number().positive(),
});

// client/src/hooks/useValidatedForm.ts
export function useValidatedForm<T extends z.ZodSchema>(schema: T) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (data: unknown): data is z.infer<T> => {
    const result = schema.safeParse(data);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach(err => {
        fieldErrors[err.path.join('.')] = err.message;
      });
      setErrors(fieldErrors);
      return false;
    }
    setErrors({});
    return true;
  };

  return { errors, validate, clearErrors: () => setErrors({}) };
}
```

**Impact:** Consistent validation UX across all forms.

---

## P2: Polish (Medium Impact, Low Effort)

### 12. Add Empty State Guidance

**Current:** Empty states show minimal text.
**Improved:** Add helpful actions and guidance.

```tsx
// client/src/components/EmptyState.tsx
interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
        <Icon className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground mb-4 max-w-sm">{description}</p>
      {action && (
        action.href ? (
          <Button asChild>
            <Link to={action.href}>{action.label}</Link>
          </Button>
        ) : (
          <Button onClick={action.onClick}>{action.label}</Button>
        )
      )}
    </div>
  );
}
```

---

### 13. Create `<FormField>` Wrapper

**Problem:** Label + Input + Error pattern repeated 20+ times.

```tsx
// client/src/components/FormField.tsx
interface FormFieldProps {
  label: string;
  error?: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}

export function FormField({ label, error, required, hint, children }: FormFieldProps) {
  return (
    <div className="space-y-2">
      <Label>
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      {children}
      {hint && !error && (
        <p className="text-sm text-muted-foreground">{hint}</p>
      )}
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  );
}
```

---

### 14. Improve Mobile Responsiveness

**Key fixes needed:**

```tsx
// ResearchWorkflow.tsx - Phase navigator
// Before: Fixed sidebar on desktop, awkward on tablet
<div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

// After: Collapsible sidebar, better tablet support
<div className="flex flex-col lg:flex-row gap-6">
  <Sheet>
    <SheetTrigger asChild className="lg:hidden">
      <Button variant="outline">View Phases</Button>
    </SheetTrigger>
    <SheetContent side="left">
      <PhaseNavigator />
    </SheetContent>
  </Sheet>

  <aside className="hidden lg:block w-64 flex-shrink-0">
    <PhaseNavigator />
  </aside>

  <main className="flex-1">
    {/* Phase content */}
  </main>
</div>
```

---

### 15. Add Keyboard Shortcuts

```tsx
// client/src/hooks/useKeyboardShortcuts.ts
export function useKeyboardShortcuts(shortcuts: Record<string, () => void>) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const key = [
        e.ctrlKey && 'ctrl',
        e.shiftKey && 'shift',
        e.key.toLowerCase()
      ].filter(Boolean).join('+');

      if (shortcuts[key]) {
        e.preventDefault();
        shortcuts[key]();
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [shortcuts]);
}

// Usage in ProposalWriter
useKeyboardShortcuts({
  'ctrl+s': handleSave,
  'ctrl+shift+e': handleExportPDF,
});
```

---

### 16. Add Breadcrumb Navigation

```tsx
// For tool pages
<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink href="/">Home</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbLink href="/tools">Tools</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbPage>Budget Calculator</BreadcrumbPage>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>
```

---

### 17. Add Confirmation Dialogs for Destructive Actions

```tsx
// client/src/components/ConfirmDialog.tsx
export function ConfirmDialog({
  trigger,
  title,
  description,
  confirmLabel = "Confirm",
  variant = "destructive",
  onConfirm
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className={variant === 'destructive' ? 'bg-destructive' : ''}>
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
```

---

### 18. Improve Error Recovery

```tsx
// Wrap API calls with better error handling
const mutation = trpc.proposals.save.useMutation({
  onError: (error) => {
    if (error.data?.code === 'UNAUTHORIZED') {
      toast.error('Session expired. Please log in again.');
      // Redirect to login
    } else if (error.data?.code === 'CONFLICT') {
      toast.error('This proposal was modified elsewhere. Refresh to see changes.');
    } else {
      toast.error('Failed to save. Your changes are preserved locally.');
      // Save to localStorage as backup
      localStorage.setItem('proposal_backup', JSON.stringify(data));
    }
  }
});
```

---

## P3: Nice to Have (Low Priority)

### 19. Add Undo/Redo for Editors

### 20. Add Autosave Indicator

```tsx
<div className="flex items-center gap-2 text-sm text-muted-foreground">
  {isSaving ? (
    <>
      <Loader2 className="h-3 w-3 animate-spin" />
      Saving...
    </>
  ) : lastSaved ? (
    <>
      <Check className="h-3 w-3 text-green-500" />
      Saved {formatDistanceToNow(lastSaved)} ago
    </>
  ) : null}
</div>
```

### 21. Add Progress Indicator for Workflow

```tsx
// Show overall workflow completion
<Progress value={(completedPhases.length / 11) * 100} className="h-2" />
<p className="text-sm text-muted-foreground mt-1">
  {completedPhases.length} of 11 phases completed
</p>
```

### 22. Add Tooltips for Complex Terms

### 23. Add Onboarding Tour for New Users

---

## Implementation Roadmap

### Week 1: Quick Wins (P0)
- [ ] Create `ProtectedPage` component
- [ ] Create `ProjectSelector` component
- [ ] Create `useArrayState` hook
- [ ] Create `ExportButtons` component
- [ ] Create `PhaseHeader` component

### Week 2: Major Components (P1 - Part 1)
- [ ] Create `ToolPage` layout component
- [ ] Refactor BudgetCalculator, TimelinePlanner, SampleSizeCalculator
- [ ] Create `WorkflowPhase` base component

### Week 3: Workflow & UX (P1 - Part 2)
- [ ] Implement missing workflow phases (3, 6, 8, 9, 10)
- [ ] Restructure Home page for clearer journey
- [ ] Add loading states throughout

### Week 4: Polish (P2)
- [ ] Standardize form validation
- [ ] Add empty states
- [ ] Improve mobile responsiveness
- [ ] Add breadcrumbs and keyboard shortcuts

---

## Summary

| Category | Current Lines | After Refactor | Reduction |
|----------|--------------|----------------|-----------|
| Auth checks | ~120 lines | ~20 lines | 83% |
| Project selectors | ~100 lines | ~25 lines | 75% |
| Workflow phases | ~1200 lines | ~600 lines | 50% |
| Tool pages | ~900 lines | ~450 lines | 50% |
| Export buttons | ~60 lines | ~15 lines | 75% |
| **Total estimated** | **~2380 lines** | **~1110 lines** | **53%** |

**Key Benefits:**
1. **~1200 lines of code removed** through consolidation
2. **Consistent UX** across all pages
3. **Faster development** for new features
4. **Easier maintenance** with single source of truth
5. **Better user journey** with clearer navigation

---

*Generated for Research-Compass UX improvement initiative*
