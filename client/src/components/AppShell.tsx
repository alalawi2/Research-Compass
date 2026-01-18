import * as React from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Home,
  FolderOpen,
  Workflow,
  Calculator,
  FlaskConical,
  FileText,
  MessageSquare,
  Search,
  DollarSign,
  Calendar,
  Settings,
  HelpCircle,
  LogOut,
  Moon,
  Sun,
  ChevronLeft,
  ChevronRight,
  Bell,
  Command,
  Compass,
  PanelLeftClose,
  PanelLeft,
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { CommandPalette } from "./CommandPalette";
import { cn } from "@/lib/utils";

interface AppShellProps {
  children: React.ReactNode;
}

interface NavItem {
  icon: React.ElementType;
  label: string;
  href: string;
  badge?: number;
}

const mainNavItems: NavItem[] = [
  { icon: Home, label: "Dashboard", href: "/" },
  { icon: FolderOpen, label: "Projects", href: "/projects" },
  { icon: Workflow, label: "Research Workflow", href: "/research-workflow" },
];

const toolNavItems: NavItem[] = [
  { icon: Calculator, label: "Sample Size", href: "/tools/sample-size" },
  { icon: FlaskConical, label: "Study Wizard", href: "/tools/study-wizard" },
  { icon: FileText, label: "Proposal Writer", href: "/tools/proposal-writer" },
  { icon: MessageSquare, label: "AI Chat", href: "/tools/chat" },
  { icon: FlaskConical, label: "Test Selector", href: "/tools/test-selector" },
  { icon: Search, label: "Literature", href: "/tools/literature" },
  { icon: DollarSign, label: "Budget", href: "/tools/budget" },
  { icon: Calendar, label: "Timeline", href: "/tools/timeline" },
];

export function AppShell({ children }: AppShellProps) {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [location] = useLocation();
  const [collapsed, setCollapsed] = React.useState(false);
  const [commandOpen, setCommandOpen] = React.useState(false);

  const userInitials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  return (
    <div className="app-shell">
      {/* Sidebar */}
      <aside
        className={cn(
          "flex flex-col border-r bg-sidebar transition-all duration-200 ease-out",
          collapsed ? "w-16" : "w-64"
        )}
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-4 border-b">
          <Link href="/">
            <a className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Compass className="h-5 w-5 text-primary-foreground" />
              </div>
              {!collapsed && (
                <span className="font-semibold text-lg">Compass</span>
              )}
            </a>
          </Link>
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 py-4">
          <nav className="px-2 space-y-1">
            {/* Main Navigation */}
            {mainNavItems.map((item) => (
              <NavLink
                key={item.href}
                item={item}
                active={location === item.href}
                collapsed={collapsed}
              />
            ))}

            <Separator className="my-4" />

            {/* Tools */}
            {!collapsed && (
              <p className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Tools
              </p>
            )}
            {toolNavItems.map((item) => (
              <NavLink
                key={item.href}
                item={item}
                active={location === item.href}
                collapsed={collapsed}
              />
            ))}
          </nav>
        </ScrollArea>

        {/* Footer */}
        <div className="border-t p-2">
          {/* Collapse Toggle */}
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-center mb-2"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? (
              <PanelLeft className="h-4 w-4" />
            ) : (
              <>
                <PanelLeftClose className="h-4 w-4 mr-2" />
                <span className="text-xs">Collapse</span>
              </>
            )}
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  "w-full",
                  collapsed ? "justify-center px-2" : "justify-start"
                )}
              >
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                {!collapsed && (
                  <div className="ml-2 text-left truncate">
                    <p className="text-sm font-medium truncate">
                      {user?.name || "User"}
                    </p>
                  </div>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="top" align="start" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col">
                  <span>{user?.name || "User"}</span>
                  <span className="text-xs text-muted-foreground font-normal">
                    {user?.email || ""}
                  </span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
                {theme === "dark" ? (
                  <Sun className="mr-2 h-4 w-4" />
                ) : (
                  <Moon className="mr-2 h-4 w-4" />
                )}
                {theme === "dark" ? "Light Mode" : "Dark Mode"}
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem>
                <HelpCircle className="mr-2 h-4 w-4" />
                Help & Support
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => logout()} className="text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      {/* Main Content */}
      <main className="app-main">
        {/* Header */}
        <header className="app-header">
          <div className="flex items-center justify-between h-full px-6">
            {/* Search / Command Palette Trigger */}
            <Button
              variant="outline"
              className="w-64 justify-start text-muted-foreground"
              onClick={() => setCommandOpen(true)}
            >
              <Search className="mr-2 h-4 w-4" />
              <span>Search...</span>
              <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                <span className="text-xs">⌘</span>K
              </kbd>
            </Button>

            {/* Right side actions */}
            <div className="flex items-center gap-2">
              {/* Notifications */}
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="notification-dot">3</span>
              </Button>

              {/* Theme Toggle (visible on mobile when sidebar is hidden) */}
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                {theme === "dark" ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="app-content">
          {children}
        </div>
      </main>

      {/* Command Palette */}
      <CommandPalette open={commandOpen} onOpenChange={setCommandOpen} />
    </div>
  );
}

// Navigation Link Component
function NavLink({
  item,
  active,
  collapsed,
}: {
  item: NavItem;
  active: boolean;
  collapsed: boolean;
}) {
  const Icon = item.icon;

  const link = (
    <Link href={item.href}>
      <a
        className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
          active
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
          collapsed && "justify-center px-2"
        )}
      >
        <Icon className="h-4 w-4 flex-shrink-0" />
        {!collapsed && <span className="truncate">{item.label}</span>}
        {!collapsed && item.badge && (
          <span className="ml-auto bg-primary/10 text-primary text-xs font-medium px-2 py-0.5 rounded-full">
            {item.badge}
          </span>
        )}
      </a>
    </Link>
  );

  if (collapsed) {
    return (
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>{link}</TooltipTrigger>
        <TooltipContent side="right" className="flex items-center gap-2">
          {item.label}
          {item.badge && (
            <span className="bg-primary/10 text-primary text-xs font-medium px-2 py-0.5 rounded-full">
              {item.badge}
            </span>
          )}
        </TooltipContent>
      </Tooltip>
    );
  }

  return link;
}

// Loading state for AppShell
export function AppShellSkeleton() {
  return (
    <div className="app-shell">
      <aside className="w-64 border-r bg-sidebar">
        <div className="h-16 border-b flex items-center px-4">
          <div className="skeleton-pulse h-8 w-8 rounded-lg" />
          <div className="skeleton-pulse h-5 w-24 ml-2 rounded" />
        </div>
        <div className="p-4 space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="skeleton-pulse h-10 rounded-lg" />
          ))}
        </div>
      </aside>
      <main className="app-main">
        <header className="app-header">
          <div className="flex items-center h-full px-6">
            <div className="skeleton-pulse h-10 w-64 rounded-lg" />
          </div>
        </header>
        <div className="app-content p-6">
          <div className="skeleton-pulse h-8 w-48 rounded mb-4" />
          <div className="skeleton-pulse h-4 w-96 rounded mb-8" />
          <div className="grid grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="skeleton-pulse h-32 rounded-lg" />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
