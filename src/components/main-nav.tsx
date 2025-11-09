import * as React from "react";
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";

import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";
import { Button } from "./ui/button";
import { EditorMenubar } from "./editor-menubar";
import {
  Download,
  Loader2Icon,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
} from "lucide-react";
import Pager from "./pager";
import { FilenameForm } from "./forms/filename-form";
import { BringYourKeysDialog } from "@/components/api-keys-dialog";

export type NavItem = {
  title: string;
  href: string;
  disabled?: boolean;
};

export type MainNavItem = NavItem;

interface MainNavProps {
  handlePrint: () => void;
  isPrinting: boolean;
  className?: string;
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
}

export function MainNav({
  handlePrint,
  isPrinting,
  className,
  onToggleSidebar,
  isSidebarOpen,
}: MainNavProps) {
  return (
    <div
      className={cn(
        "flex gap-4 md:gap-10 justify-between items-center",
        className
      )}
    >
      <div className="flex gap-2 md:gap-4 items-center">
        <Button
          variant="ghost"
          size={"icon"}
          className="hidden md:flex"
          onClick={onToggleSidebar}
          aria-pressed={isSidebarOpen}
          aria-label={isSidebarOpen ? "Hide settings panel" : "Show settings panel"}
        >
          {isSidebarOpen ? (
            <PanelLeftClose className="h-4 w-4" />
          ) : (
            <PanelLeftOpen className="h-4 w-4" />
          )}
        </Button>
        <Link href="/" className="items-center space-x-2 flex">
          <Icons.logo />
          <span className="hidden font-bold md:inline-block">
            Carousel Generator
          </span>
        </Link>
        <EditorMenubar />
      </div>
      <div className="hidden lg:block">
        <Pager />
      </div>
      <div className="flex gap-2 items-center">
        <div className="hidden md:block">
          <FilenameForm />
        </div>
        <Button variant="ghost" size={"icon"} onClick={handlePrint}>
          <div className="flex flex-row gap-1 items-center">
            {isPrinting ? (
              <Loader2Icon className="w-4 h-4 animate-spin" />
            ) : (
              <Download />
            )}
          </div>
        </Button>
        {/* <BringYourKeysDialog
          triggerButton={
            <Button variant="ghost" size={"icon"}>
              <div className="flex flex-row gap-1 items-center">
                <Settings />
              </div>
            </Button>
          }
        /> */}
      </div>
    </div>
  );
}
