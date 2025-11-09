"use client";

import { SidebarPanel } from "@/components/settings-panel";
import { SlidesEditor } from "@/components/slides-editor";
import React, { useState } from "react";
import { useComponentPrinter } from "@/lib/hooks/use-component-printer";

import { RefProvider } from "@/lib/providers/reference-context";
import { MainNav } from "./main-nav";
import { cn } from "@/lib/utils";

export default function Editor({}: {}) {
  const { componentRef, handlePrint, isPrinting } = useComponentPrinter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <RefProvider myRef={componentRef}>
      <div className="flex-1 flex flex-col min-h-0">
        <MainNav
          className="h-14 border-b px-6 "
          handlePrint={handlePrint}
          isPrinting={isPrinting}
          onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
          isSidebarOpen={isSidebarOpen}
        />
        <div
          className={cn(
            "flex-1 flex flex-start min-h-0 overflow-hidden",
            isSidebarOpen && "md:grid md:grid-cols-[320px_minmax(0,1fr)]"
          )}
        >
          <SidebarPanel desktopHidden={!isSidebarOpen} />
          <SlidesEditor />
        </div>
      </div>
    </RefProvider>
  );
}
