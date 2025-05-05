"use client";

import * as React from "react";
import { Divider } from "@mui/material";
import { cn } from "@/lib/utils";

export interface SeparatorProps
  extends React.ComponentPropsWithoutRef<typeof Divider> {
  orientation?: "horizontal" | "vertical";
  decorative?: boolean; // retained for API compatibility
}

const Separator = React.forwardRef<HTMLHRElement, SeparatorProps>(
  ({ className, orientation = "horizontal", decorative = true, ...props }, ref) => (
    <Divider
      ref={ref}
      orientation={orientation}
      role={decorative ? "presentation" : "separator"}
      className={cn(
        "bg-border shrink-0",
        orientation === "horizontal" ? "h-[1px] w-full" : "w-[1px] h-full",
        className
      )}
      {...props}
    />
  )
);
Separator.displayName = "Separator";

export { Separator };

