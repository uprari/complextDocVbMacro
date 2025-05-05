"use client";

import * as React from "react";
import { Tooltip as MuiTooltip, TooltipProps } from "@mui/material";
import { cn } from "@/lib/utils";

// TooltipProvider - MUI does not require a provider, so this is a passthrough
const TooltipProvider = ({ children }: { children: React.ReactNode }) => (
  <>{children}</>
);

// Tooltip Root - wraps trigger + content
const Tooltip = ({
  title,
  children,
  className,
  enterDelay = 300,
  ...props
}: TooltipProps & { className?: string }) => {
  return (
    <MuiTooltip
      title={
        <span
          className={cn(
            "px-3 py-1.5 text-xs font-medium rounded-md border bg-popover text-popover-foreground shadow-md",
            className
          )}
        >
          {title}
        </span>
      }
      enterDelay={enterDelay}
      arrow
      {...props}
    >
      {children}
    </MuiTooltip>
  );
};

// TooltipTrigger - not strictly needed in MUI, but keeping API symmetry
const TooltipTrigger = ({ children }: { children: React.ReactElement }) => {
  return children;
};

// TooltipContent - MUI handles this internally via the `title` prop
// So

