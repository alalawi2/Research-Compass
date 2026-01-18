import * as React from "react";
import { useLocation } from "wouter";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Calculator,
  FileText,
  MessageSquare,
  BookOpen,
  DollarSign,
  Calendar,
  FlaskConical,
  Search,
  Workflow,
  Home,
  FolderOpen,
  Settings,
  Moon,
  Sun,
  Plus,
  ClipboardList,
  HelpCircle,
  Keyboard,
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

interface CommandPaletteProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const [, setLocation] = useLocation();
  const { theme, setTheme } = useTheme();

  const isOpen = open ?? internalOpen;
  const setIsOpen = onOpenChange ?? setInternalOpen;

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen(!isOpen);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [isOpen, setIsOpen]);

  const runCommand = React.useCallback((command: () => void) => {
    setIsOpen(false);
    command();
  }, [setIsOpen]);

  const navigationItems = [
    { icon: Home, label: "Dashboard", shortcut: "⌘1", href: "/" },
    { icon: FolderOpen, label: "My Projects", shortcut: "⌘2", href: "/projects" },
    { icon: Workflow, label: "Research Workflow", shortcut: "⌘W", href: "/research-workflow" },
  ];

  const toolItems = [
    { icon: Calculator, label: "Sample Size Calculator", href: "/tools/sample-size" },
    { icon: FlaskConical, label: "Study Type Wizard", href: "/tools/study-wizard" },
    { icon: FileText, label: "AI Proposal Writer", href: "/tools/proposal-writer" },
    { icon: MessageSquare, label: "Research Assistant Chat", href: "/tools/chat" },
    { icon: FlaskConical, label: "Statistical Test Selector", href: "/tools/test-selector" },
    { icon: Search, label: "Literature Search", href: "/tools/literature" },
    { icon: DollarSign, label: "Budget Calculator", href: "/tools/budget" },
    { icon: Calendar, label: "Timeline Planner", href: "/tools/timeline" },
  ];

  const actionItems = [
    {
      icon: Plus,
      label: "Create New Project",
      shortcut: "⌘⇧N",
      action: () => setLocation("/projects?new=true")
    },
    {
      icon: ClipboardList,
      label: "Start Research Workflow",
      action: () => setLocation("/research-workflow")
    },
  ];

  return (
    <CommandDialog open={isOpen} onOpenChange={setIsOpen}>
      <CommandInput placeholder="Search or type a command..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading="Quick Actions">
          {actionItems.map((item) => (
            <CommandItem
              key={item.label}
              onSelect={() => runCommand(item.action)}
            >
              <item.icon className="mr-2 h-4 w-4" />
              <span>{item.label}</span>
              {item.shortcut && (
                <span className="ml-auto text-xs text-muted-foreground">
                  {item.shortcut}
                </span>
              )}
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Navigation">
          {navigationItems.map((item) => (
            <CommandItem
              key={item.label}
              onSelect={() => runCommand(() => setLocation(item.href))}
            >
              <item.icon className="mr-2 h-4 w-4" />
              <span>{item.label}</span>
              {item.shortcut && (
                <span className="ml-auto text-xs text-muted-foreground">
                  {item.shortcut}
                </span>
              )}
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Research Tools">
          {toolItems.map((item) => (
            <CommandItem
              key={item.label}
              onSelect={() => runCommand(() => setLocation(item.href))}
            >
              <item.icon className="mr-2 h-4 w-4" />
              <span>{item.label}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Settings">
          <CommandItem
            onSelect={() => runCommand(() => setTheme(theme === "dark" ? "light" : "dark"))}
          >
            {theme === "dark" ? (
              <Sun className="mr-2 h-4 w-4" />
            ) : (
              <Moon className="mr-2 h-4 w-4" />
            )}
            <span>Toggle {theme === "dark" ? "Light" : "Dark"} Mode</span>
            <span className="ml-auto text-xs text-muted-foreground">⌘D</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => {})}>
            <Keyboard className="mr-2 h-4 w-4" />
            <span>Keyboard Shortcuts</span>
            <span className="ml-auto text-xs text-muted-foreground">⌘/</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => {})}>
            <HelpCircle className="mr-2 h-4 w-4" />
            <span>Help & Support</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>

      <div className="border-t p-2">
        <p className="text-xs text-muted-foreground text-center">
          <span className="kbd">↑↓</span> to navigate · <span className="kbd">↵</span> to select · <span className="kbd">esc</span> to close
        </p>
      </div>
    </CommandDialog>
  );
}

// Hook to use command palette anywhere
export function useCommandPalette() {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return { open, setOpen };
}
