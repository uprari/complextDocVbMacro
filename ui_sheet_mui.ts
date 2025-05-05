"use client";

import * as React from "react";
import { Drawer, Box, IconButton, Typography, Divider } from "@mui/material";
import { cn } from "@/lib/utils";
import { IconClose } from "@/components/ui/icons";

// === Sheet Component ===
const Sheet = ({
  open,
  onClose,
  children,
  ...props
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) => {
  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      sx={{
        "& .MuiDrawer-paper": {
          width: "100%",
          maxWidth: "20rem", // Adjust this based on your layout
          height: "100%",
          padding: "1.5rem",
          boxSizing: "border-box",
          border: "none",
        },
      }}
      {...props}
    >
      {children}
    </Drawer>
  );
};

// === SheetTrigger ===
const SheetTrigger = ({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) => {
  return (
    <span onClick={onClick} className="cursor-pointer">
      {children}
    </span>
  );
};

// === SheetContent ===
const SheetContent = ({
  children,
  onClose,
  className,
  ...props
}: {
  children: React.ReactNode;
  onClose: () => void;
  className?: string;
}) => {
  return (
    <Box className={cn("flex flex-col", className)} {...props}>
      {children}
      <IconButton
        onClick={onClose}
        sx={{
          position: "absolute",
          top: 16,
          right: 16,
          opacity: 0.7,
          "&:hover": {
            opacity: 1,
          },
        }}
      >
        <IconClose />
      </IconButton>
    </Box>
  );
};

// === SheetHeader ===
const SheetHeader = ({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <Box
    className={cn("flex flex-col space-y-2", className)}
    {...props}
  >
    {children}
  </Box>
);

// === SheetFooter ===
const SheetFooter = ({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <Box
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  >
    {children}
  </Box>
);

// === SheetTitle ===
const SheetTitle = ({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) => (
  <Typography
    variant="h6"
    className={cn("font-semibold text-foreground", className)}
    {...props}
  >
    {children}
  </Typography>
);

// === SheetDescription ===
const SheetDescription = ({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) => (
  <Typography
    variant="body2"
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  >
    {children}
  </Typography>
);

export {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
};

