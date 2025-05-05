"use client";

import * as React from "react";
import {
  Menu,
  MenuItem,
  MenuProps,
  MenuList,
  Divider,
  Typography,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

import { cn } from "@/lib/utils";

// === Root Hook ===
function useDropdownMenu() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const onOpen = (event: React.MouseEvent<HTMLElement>) =>
    setAnchorEl(event.currentTarget);
  const onClose = () => setAnchorEl(null);

  return { anchorEl, open, onOpen, onClose };
}

// === DropdownMenu (Context wrapper) ===
const DropdownMenu = ({
  children,
}: {
  children: (menu: ReturnType<typeof useDropdownMenu>) => React.ReactNode;
}) => {
  const menu = useDropdownMenu();
  return <>{children(menu)}</>;
};

// === Trigger ===
const DropdownMenuTrigger = ({
  children,
  onClick,
  menu,
}: {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  menu: ReturnType<typeof useDropdownMenu>;
}) => {
  return (
    <span onClick={(e) => { onClick?.(e); menu.onOpen(e); }} className="cursor-pointer">
      {children}
    </span>
  );
};

// === Content ===
const DropdownMenuContent = ({
  className,
  menu,
  children,
  ...props
}: MenuProps & {
  className?: string;
  menu: ReturnType<typeof useDropdownMenu>;
}) => {
  return (
    <Menu
      anchorEl={menu.anchorEl}
      open={menu.open}
      onClose={menu.onClose}
      className={cn("z-50", className)}
      {...props}
    >
      <MenuList className="min-w-[8rem] p-1 rounded-md shadow-md border bg-popover text-popover-foreground">
        {children}
      </MenuList>
    </Menu>
  );
};

// === Item ===
const DropdownMenuItem = ({
  className,
  inset,
  children,
  ...props
}: React.ComponentProps<typeof MenuItem> & { inset?: boolean }) => {
  return (
    <MenuItem
      className={cn(
        "relative flex items-center text-sm px-2 py-1.5 rounded-sm transition-colors focus:bg-accent focus:text-accent-foreground",
        inset && "pl-8",
        className
      )}
      {...props}
    >
      {children}
    </MenuItem>
  );
};

// === Label ===
const DropdownMenuLabel = ({
  className,
  inset,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { inset?: boolean }) => (
  <Typography
    variant="subtitle2"
    className={cn("px-2 py-1.5 text-sm font-semibold", inset && "pl-8", className)}
    {...props}
  >
    {children}
  </Typography>
);

// === Separator ===
const DropdownMenuSeparator = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLHRElement>) => (
  <Divider className={cn("-mx-1 my-1 h-px bg-muted", className)} {...props} />
);

// === Shortcut ===
const DropdownMenuShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => (
  <span
    className={cn("ml-auto text-xs tracking-widest opacity-60", className)}
    {...props}
  />
);

// === Group & Sub not available in MUI out-of-the-box ===
// You can simulate Grouping with <Box>, or nested Menus manually if needed

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
};

