"use client";

import * as React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Box,
  Fade,
} from "@mui/material";
import { styled } from "@mui/material/styles";

// Utility to merge class names (if still using Tailwind or similar)
import { cn } from "@/lib/utils";

// Custom transition for dialog animations
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Fade ref={ref} {...props} />;
});

// Root component (Dialog)
const AlertDialog = ({ open, onOpenChange, children, ...props }) => {
  return (
    <Dialog
      open={open}
      onClose={() => onOpenChange(false)}
      TransitionComponent={Transition}
      {...props}
    >
      {children}
    </Dialog>
  );
};
AlertDialog.displayName = "AlertDialog";

// Trigger component (e.g., a button to open the dialog)
const AlertDialogTrigger = ({ children, onClick, ...props }) => {
  return React.cloneElement(children, {
    onClick: (e) => {
      if (onClick) onClick(e);
      // Assuming the parent manages the open state
    },
    ...props,
  });
};
AlertDialogTrigger.displayName = "AlertDialogTrigger";

// Content component (Dialog content with styling)
const AlertDialogContent = React.forwardRef(
  ({ className, children, ...props }, ref) => (
    <DialogContent
      ref={ref}
      sx={{
        width: "100%",
        maxWidth: "lg",
        bgcolor: "background.paper",
        p: 3,
        borderRadius: { sm: 2 },
        boxShadow: 24,
        transform: "scale(1)",
        opacity: 1,
        // Approximate animations
        transition: "opacity 0.2s ease-in, transform 0.2s ease-in",
        "@media (min-width: 600px)": {
          transform: "scale(1)",
        },
        ...props.sx,
      }}
      className={cn(className)}
      {...props}
    >
      {children}
    </DialogContent>
  )
);
AlertDialogContent.displayName = "AlertDialogContent";

// Header component
const AlertDialogHeader = ({ className, ...props }) => (
  <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      gap: 1,
      textAlign: { xs: "center", sm: "left" },
    }}
    className={cn(className)}
    {...props}
  />
);
AlertDialogHeader.displayName = "AlertDialogHeader";

// Footer component
const AlertDialogFooter = ({ className, ...props }) => (
  <DialogActions
    sx={{
      display: "flex",
      flexDirection: { xs: "column-reverse", sm: "row" },
      justifyContent: { sm: "flex-end" },
      gap: { sm: 1 },
    }}
    className={cn(className)}
    {...props}
  />
);
AlertDialogFooter.displayName = "AlertDialogFooter";

// Title component
const AlertDialogTitle = React.forwardRef(
  ({ className, ...props }, ref) => (
    <DialogTitle
      ref={ref}
      sx={{
        fontSize: "1.125rem",
        fontWeight: 600,
        ...props.sx,
      }}
      className={cn(className)}
      {...props}
    />
  )
);
AlertDialogTitle.displayName = "AlertDialogTitle";

// Description component
const AlertDialogDescription = React.forwardRef(
  ({ className, ...props+ = React.forwardRef(
  ({ className, ...props }, ref) => (
    <DialogContentText
      ref={ref}
      sx={{
        fontSize: "0.875rem",
        color: "text.secondary",
        ...props.sx,
      }}
      className={cn(className)}
      {...props}
    />
  )
);
AlertDialogDescription.displayName = "AlertDialogDescription";

// Action button
const AlertDialogAction = React.forwardRef(
  ({ className, ...props }, ref) => (
    <Button
      ref={ref}
      variant="contained"
      sx={{ ...props.sx }}
      className={cn(className)}
      {...props}
    />
  )
);
AlertDialogAction.displayName = "AlertDialogAction";

// Cancel button
const AlertDialogCancel = React.forwardRef(
  ({ className, ...props }, ref) => (
    <Button
      ref={ref}
      variant="outlined"
      sx={{
        mt: { xs: 1, sm: 0 },
        ...props.sx,
      }}
      className={cn(className)}
      {...props}
    />
  )
);
AlertDialogCancel.displayName = "AlertDialogCancel";

export {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
};
