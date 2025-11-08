"use client";

import Link from "next/link";
// import { SidebarNavItem } from "types/nav";

import { cn } from "@/lib/utils";
import { BrandForm } from "@/components/forms/brand-form";
import { ThemeForm } from "@/components/forms/theme-form";
import {
  VerticalTabs,
  VerticalTabsContent,
  VerticalTabsList,
  VerticalTabsTrigger,
} from "@/components/ui/vertical-tabs";
import { usePagerContext } from "@/lib/providers/pager-context";
import { Separator } from "@/components/ui/separator";
import { FontsForm } from "@/components/forms/fonts-form";
import { PageNumberForm } from "./forms/page-number-form";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Briefcase,
  Brush,
  FileDigit,
  LucideIcon,
  Palette,
  Plus,
  Type,
  Sparkles,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Drawer } from "vaul";
import { DrawerContent, DrawerTrigger } from "@/components/drawer";
import { ReactNode, useEffect, useState } from "react";
import { buttonVariants } from "./ui/button";
import { useSelectionContext } from "@/lib/providers/selection-context";
import { useFieldsFileImporter } from "@/lib/hooks/use-fields-file-importer";
import { set } from "zod";
import { StyleMenu } from "@/components/style-menu";
import { useFormContext } from "react-hook-form";
import { DocumentFormReturn } from "@/lib/document-form-types";
import { DesignTemplateSelector } from "@/components/design-template-selector";

type TabInfo = {
  name: string;
  value: string;
  icon: LucideIcon;
};

const ALL_FORMS: Record<string, TabInfo> = {
  design: {
    name: "Design",
    value: "design",
    icon: Sparkles,
  },
  brand: {
    name: "Brand",
    value: "brand",
    icon: Briefcase,
  },
  theme: {
    name: "Theme",
    value: "theme",
    icon: Palette,
  },
  fonts: {
    name: "Fonts",
    value: "fonts",
    icon: Type,
  },
  pageNumber: {
    name: "Numbers",
    value: "number",
    icon: FileDigit,
  },
};

export function SidebarPanel({ className }: { className?: string }) {
  const form: DocumentFormReturn = useFormContext();
  const { currentSelection } = useSelectionContext();

  return (
    <div className={cn("h-full flex flex-1", className)}>
      <aside className="top-14 z-30 hidden h-full w-full shrink-0 md:sticky md:block border-r">
        <SidebarTabsPanel />
      </aside>
      <div className="block md:hidden h-0">
        <Drawer.Root modal={true}>
          <DrawerTrigger>
            <CircularFloatingButton className="bottom-28 left-4">
              <Plus className="w-4 h-4" />
            </CircularFloatingButton>
          </DrawerTrigger>
          <DrawerContent className="h-[60%] ">
            <DrawerFormsPanel className="mt-8" />
          </DrawerContent>
        </Drawer.Root>
      </div>
      <div className="block md:hidden h-0">
        <Drawer.Root modal={true}>
          <DrawerTrigger>
            {currentSelection ? (
              <CircularFloatingButton className="bottom-28 right-4">
                <Brush className="w-4 h-4" />
              </CircularFloatingButton>
            ) : null}
          </DrawerTrigger>
          <DrawerContent className="h-[40%] ">
            <StyleMenu form={form} className={"m-4"} />
          </DrawerContent>
        </Drawer.Root>
      </div>
    </div>
  );
}

function VerticalTabTriggerButton({ tabInfo }: { tabInfo: TabInfo }) {
  const { setCurrentSelection } = useSelectionContext();
  return (
    <VerticalTabsTrigger
      value={tabInfo.value}
      className="h-16 flex flex-col gap-2 items-center py-2 justify-center"
      onFocus={() => setCurrentSelection("", null)}
    >
      <tabInfo.icon className="h-4 w-4" />
      <span className="sr-only ">{tabInfo.name}</span>
      <p className="text-xs">{tabInfo.name}</p>
    </VerticalTabsTrigger>
  );
}

function HorizontalTabTriggerButton({ tabInfo }: { tabInfo: TabInfo }) {
  const { setCurrentSelection } = useSelectionContext();
  return (
    <TabsTrigger
      value={tabInfo.value}
      className="h-16 flex flex-col gap-2 items-center py-2 justify-center"
      onFocus={() => setCurrentSelection("", null)}
    >
      <tabInfo.icon className="h-4 w-4" />
      <span className="sr-only ">{tabInfo.name}</span>
      <p className="text-xs">{tabInfo.name}</p>
    </TabsTrigger>
  );
}

export function SidebarTabsPanel() {
  const { currentSelection } = useSelectionContext();
  const [tab, setTab] = useState(ALL_FORMS.design.value);
  const form: DocumentFormReturn = useFormContext();

  return (
    <VerticalTabs
      value={currentSelection ? "" : tab}
      onValueChange={(val) => {
        if (val) {
          // Don't lost previous state when showing current selection
          setTab(val);
        }
      }}
      className="flex-1 h-full p-0"
    >
      <div className="flex flex-row h-full w-full">
        <ScrollArea className="border-r h-full bg-muted">
          <VerticalTabsList className="grid grid-cols-1 gap-2 w-20 rounded-none">
            <VerticalTabTriggerButton tabInfo={ALL_FORMS.design} />
            <VerticalTabTriggerButton tabInfo={ALL_FORMS.brand} />
            <VerticalTabTriggerButton tabInfo={ALL_FORMS.theme} />
            <VerticalTabTriggerButton tabInfo={ALL_FORMS.fonts} />
            <VerticalTabTriggerButton tabInfo={ALL_FORMS.pageNumber} />
          </VerticalTabsList>
        </ScrollArea>
        <ScrollArea className="h-full w-full">
          <div className="p-2 flex flex-col items-stretch w-full h-full">
            {currentSelection ? (
              <StyleMenu form={form} className={"m-4"} />
            null}
            <VerticalTabsContent
              value={ALL_FORMS.design.value}
              className="mt-0 border-0 p-0 m-4 overflow-y-auto"
            >
              <h4 className="text-xl font-semibold">{ALL_FORMS.design.name}</h4>
              <Separator className="mt-2 mb-4"></Separator>
              <DesignTemplateSelector />
            </VerticalTabsContent>
          <VerticalTabsContent
            value={ALL_FORMS.brand.value}
            className="mt-0 border-0 p-0 m-4"
          >
            <h4 className="text-xl font-semibold">{ALL_FORMS.brand.name}</h4>
            <Separator className="mt-2 mb-4"></Separator>
            <BrandForm />
          </VerticalTabsContent>
          <VerticalTabsContent
            value={ALL_FORMS.theme.value}
            className="mt-0 border-0 p-0 m-4"
          >
            <h4 className="text-xl font-semibold">{ALL_FORMS.theme.name}</h4>
            <Separator className="mt-2 mb-4"></Separator>
            <ThemeForm />
          </VerticalTabsContent>
          <VerticalTabsContent
            value={ALL_FORMS.fonts.value}
            className="mt-0 border-0 p-0 m-4"
          >
            <h4 className="text-xl font-semibold">{ALL_FORMS.fonts.name}</h4>
            <Separator className="mt-2 mb-4"></Separator>
            <FontsForm />
          </VerticalTabsContent>
          <VerticalTabsContent
            value={ALL_FORMS.pageNumber.value}
            className="mt-0 border-0 p-0 m-4"
          >
            <h4 className="text-xl font-semibold">
              {ALL_FORMS.pageNumber.name}
            </h4>
            <Separator className="mt-2 mb-4"></Separator>
            <PageNumberForm />
          </VerticalTabsContent>
          </div>
          <ScrollBar orientation="vertical" />
        </ScrollArea>
      </div>
    </VerticalTabs>
  );
}

export function DrawerFormsPanel({ className }: { className: string }) {
  const { currentSelection } = useSelectionContext();
  const [tab, setTab] = useState(ALL_FORMS.design.value);

  return (
    <Tabs
      value={currentSelection ? "" : tab}
      onValueChange={(val) => {
        if (val) {
          // Don't lost previous state when showing current selection
          setTab(val);
        }
      }}
      className={cn("flex-1 w-full", className)}
    >
      <div className="flex flex-col h-full ">
        <ScrollArea className=" border-b h-full bg-muted">
          <TabsList className="grid grid-cols-5 gap-2 h-20 rounded-none">
            <HorizontalTabTriggerButton tabInfo={ALL_FORMS.design} />
            <HorizontalTabTriggerButton tabInfo={ALL_FORMS.brand} />
            <HorizontalTabTriggerButton tabInfo={ALL_FORMS.theme} />
            <HorizontalTabTriggerButton tabInfo={ALL_FORMS.fonts} />
            <HorizontalTabTriggerButton tabInfo={ALL_FORMS.pageNumber} />
          </TabsList>
        </ScrollArea>
        <div className="p-2 w-[320px] m-auto">
          <TabsContent
            value={ALL_FORMS.design.value}
            className="mt-0 border-0 p-0 m-4 "
          >
            <h4 className="text-xl font-semibold">{ALL_FORMS.design.name}</h4>
            <Separator className="mt-2 mb-4"></Separator>
            <DesignTemplateSelector />
          </TabsContent>
          <TabsContent
            value={ALL_FORMS.brand.value}
            className="mt-0 border-0 p-0 m-4 "
          >
            <h4 className="text-xl font-semibold">{ALL_FORMS.brand.name}</h4>
            <Separator className="mt-2 mb-4"></Separator>
            <BrandForm />
          </TabsContent>
          <TabsContent
            value={ALL_FORMS.theme.value}
            className="mt-0 border-0 p-0 m-4 "
          >
            <h4 className="text-xl font-semibold">{ALL_FORMS.theme.name}</h4>
            <Separator className="mt-2 mb-4"></Separator>
            <ThemeForm />
          </TabsContent>
          <TabsContent
            value={ALL_FORMS.fonts.value}
            className="mt-0 border-0 p-0 m-4"
          >
            <h4 className="text-xl font-semibold">{ALL_FORMS.fonts.name}</h4>
            <Separator className="mt-2 mb-4"></Separator>
            <FontsForm />
          </TabsContent>
          <TabsContent
            value={ALL_FORMS.pageNumber.value}
            className="mt-0 border-0 p-0 m-4"
          >
            <h4 className="text-xl font-semibold">
              {ALL_FORMS.pageNumber.name}
            </h4>
            <Separator className="mt-2 mb-4"></Separator>
            <PageNumberForm />
          </TabsContent>
        </div>
      </div>
    </Tabs>
  );
}

const CircularFloatingButton = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        buttonVariants({
          variant: "default",
          size: "icon",
        }),
        "fixed bottom-4 right-4 rounded-full w-12 h-12 ",
        className
      )}
    >
      {children}
    </div>
  );
};
