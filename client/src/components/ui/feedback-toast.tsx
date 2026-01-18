import * as React from "react";
import { toast } from "sonner";
import { CheckCircle2, XCircle, AlertTriangle, Info, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ToastOptions {
  title: string;
  description?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// Success toast with checkmark animation
export function toastSuccess(options: ToastOptions) {
  return toast.custom(
    (t) => (
      <div className="flex items-start gap-3 bg-card border border-success/20 rounded-xl p-4 shadow-lg animate-slide-in-right min-w-[320px]">
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-success/10 flex items-center justify-center">
          <CheckCircle2 className="w-5 h-5 text-success animate-check" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-foreground">{options.title}</p>
          {options.description && (
            <p className="text-sm text-muted-foreground mt-0.5">
              {options.description}
            </p>
          )}
          {options.action && (
            <button
              onClick={() => {
                options.action?.onClick();
                toast.dismiss(t);
              }}
              className="text-sm text-success font-medium mt-2 hover:underline"
            >
              {options.action.label}
            </button>
          )}
        </div>
      </div>
    ),
    { duration: options.duration || 4000 }
  );
}

// Error toast with shake animation
export function toastError(options: ToastOptions) {
  return toast.custom(
    (t) => (
      <div className="flex items-start gap-3 bg-card border border-destructive/20 rounded-xl p-4 shadow-lg animate-slide-in-right min-w-[320px]">
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center animate-shake">
          <XCircle className="w-5 h-5 text-destructive" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-foreground">{options.title}</p>
          {options.description && (
            <p className="text-sm text-muted-foreground mt-0.5">
              {options.description}
            </p>
          )}
          {options.action && (
            <button
              onClick={() => {
                options.action?.onClick();
                toast.dismiss(t);
              }}
              className="text-sm text-destructive font-medium mt-2 hover:underline"
            >
              {options.action.label}
            </button>
          )}
        </div>
      </div>
    ),
    { duration: options.duration || 5000 }
  );
}

// Warning toast
export function toastWarning(options: ToastOptions) {
  return toast.custom(
    (t) => (
      <div className="flex items-start gap-3 bg-card border border-warning/20 rounded-xl p-4 shadow-lg animate-slide-in-right min-w-[320px]">
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-warning/10 flex items-center justify-center">
          <AlertTriangle className="w-5 h-5 text-warning" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-foreground">{options.title}</p>
          {options.description && (
            <p className="text-sm text-muted-foreground mt-0.5">
              {options.description}
            </p>
          )}
          {options.action && (
            <button
              onClick={() => {
                options.action?.onClick();
                toast.dismiss(t);
              }}
              className="text-sm text-warning font-medium mt-2 hover:underline"
            >
              {options.action.label}
            </button>
          )}
        </div>
      </div>
    ),
    { duration: options.duration || 5000 }
  );
}

// Info toast
export function toastInfo(options: ToastOptions) {
  return toast.custom(
    (t) => (
      <div className="flex items-start gap-3 bg-card border border-info/20 rounded-xl p-4 shadow-lg animate-slide-in-right min-w-[320px]">
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-info/10 flex items-center justify-center">
          <Info className="w-5 h-5 text-info" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-foreground">{options.title}</p>
          {options.description && (
            <p className="text-sm text-muted-foreground mt-0.5">
              {options.description}
            </p>
          )}
          {options.action && (
            <button
              onClick={() => {
                options.action?.onClick();
                toast.dismiss(t);
              }}
              className="text-sm text-info font-medium mt-2 hover:underline"
            >
              {options.action.label}
            </button>
          )}
        </div>
      </div>
    ),
    { duration: options.duration || 4000 }
  );
}

// Loading toast with promise
interface PromiseToastOptions<T> {
  loading: string;
  success: string | ((data: T) => string);
  error: string | ((err: unknown) => string);
}

export function toastPromise<T>(
  promise: Promise<T>,
  options: PromiseToastOptions<T>
) {
  return toast.promise(promise, {
    loading: (
      <div className="flex items-center gap-3">
        <Loader2 className="w-5 h-5 text-primary animate-spin" />
        <span>{options.loading}</span>
      </div>
    ),
    success: (data) => (
      <div className="flex items-center gap-3">
        <CheckCircle2 className="w-5 h-5 text-success animate-check" />
        <span>
          {typeof options.success === "function"
            ? options.success(data)
            : options.success}
        </span>
      </div>
    ),
    error: (err) => (
      <div className="flex items-center gap-3">
        <XCircle className="w-5 h-5 text-destructive" />
        <span>
          {typeof options.error === "function"
            ? options.error(err)
            : options.error}
        </span>
      </div>
    ),
  });
}

// Undo toast for reversible actions
interface UndoToastOptions {
  title: string;
  description?: string;
  onUndo: () => void;
  duration?: number;
}

export function toastUndo(options: UndoToastOptions) {
  return toast.custom(
    (t) => (
      <div className="flex items-center gap-3 bg-card border rounded-xl p-4 shadow-lg animate-slide-in-right min-w-[320px]">
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-foreground">{options.title}</p>
          {options.description && (
            <p className="text-sm text-muted-foreground mt-0.5">
              {options.description}
            </p>
          )}
        </div>
        <button
          onClick={() => {
            options.onUndo();
            toast.dismiss(t);
          }}
          className="flex-shrink-0 px-3 py-1.5 text-sm font-medium text-primary bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors"
        >
          Undo
        </button>
      </div>
    ),
    { duration: options.duration || 5000 }
  );
}
