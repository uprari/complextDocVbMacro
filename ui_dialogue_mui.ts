"use client";

import * as React from "react";
import MuiDialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";

import { cn } from "@/lib/utils";
import { IconClose } from "@/components/ui/icons";

// Optional: Slide transition like Radix animation
const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

// Dialog context state
type DialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
};

const Dialog = ({ open, onOpenChange, children }: DialogProps) => {
  return (
    <MuiDialog
      open={open}
      onClose={() => onOpenChange(false)}
      TransitionComponent={Transition}
      fullWidth
      maxWidth="sm"
    >
      {children}
    </MuiDialog>
  );
};

// Dialog Trigger (used to open the dialog externally)
const DialogTrigger = ({
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

// Content wrapper — allows for styling
const DialogContentWrapper = ({
  className,
  children,
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "bg-background p-6 shadow-sm sm:rounded-lg",
      className
    )}
  >
    {children}
  </div>
);

// Dialog Header
const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("flex flex-col space-y-1.5 text-center sm:text-left", className)}
    {...props}
  />
);

// Dialog Footer
const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <DialogActions
    className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)}
    {...props}
  />
);

// Dialog Title
const Title = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof DialogTitle>
>(({ className, children, ...props }, ref) => (
  <DialogTitle
    ref={ref}
    className={cn("text-lg font-semibold leading-none tracking-tight", className)}
    {...props}
  >
    {children}
  </DialogTitle>
));
Title.displayName = "DialogTitle";

// Dialog Description
const DialogDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
));
DialogDescription.displayName = "DialogDescription";

// Close Button
const DialogClose = ({ onClick }: { onClick: () => void }) => (
  <IconButton
    onClick={onClick}
    className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
  >
    <IconClose />
    <span className="sr-only">Close</span>
  </IconButton>
);

export {
  Dialog,
  DialogTrigger,
  DialogContentWrapper as DialogContent,
  DialogHeader,
  DialogFooter,
  Title as DialogTitle,
  DialogDescription,
  DialogClose,
};

