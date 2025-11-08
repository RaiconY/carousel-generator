"use client";
import { Button } from "@/components/ui/button";
import { usePagerContext } from "@/lib/providers/pager-context";
import { DocumentSchema } from "@/lib/validation/document-schema";
import { useFormContext } from "react-hook-form";
import {
  CornerUpRight,
  CornerUpLeft,
  Copy,
  Trash,
  ChevronLeft,
  ChevronRight,
  Download,
  Clipboard,
} from "lucide-react";
import {
  DocumentFormReturn,
  SlidesFieldArrayReturn,
} from "@/lib/document-form-types";
import { useFieldArrayValues } from "@/lib/hooks/use-field-array-values";
import { cn } from "@/lib/utils";
import { getSlideNumber } from "@/lib/field-path";
import { exportSlideToPng, copySlideToPng } from "@/lib/export-slide-png";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

export default function SlideMenubar({
  slidesFieldArray,
  fieldName,
  className = "",
}: {
  slidesFieldArray: SlidesFieldArrayReturn;
  fieldName: string;
  className?: string;
}) {
  const { setCurrentPage } = usePagerContext();
  const { numPages } = useFieldArrayValues("slides");
  const { watch }: DocumentFormReturn = useFormContext(); // retrieve those props
  const currentSlidesValues = watch("slides");
  const currentPage = getSlideNumber(fieldName);
  const { remove, swap, insert } = slidesFieldArray;
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const handleDownloadPng = async () => {
    setIsExporting(true);
    try {
      if (process.env.NODE_ENV !== "production") {
        console.log("Attempting to export slide", currentPage);
      }

      // Find the slide element by its carousel item ID
      const carouselItem = document.getElementById(`carousel-item-${currentPage}`);
      if (!carouselItem) {
        if (process.env.NODE_ENV !== "production") {
          console.error("Carousel item not found:", `carousel-item-${currentPage}`);
        }
        throw new Error("Slide element not found");
      }

      if (process.env.NODE_ENV !== "production") {
        console.log("Found carousel item:", carouselItem);
      }

      // Find the actual slide content (PageBase element)
      const slideElement = carouselItem.querySelector('[id^="page-base-"]') as HTMLElement;
      if (!slideElement) {
        if (process.env.NODE_ENV !== "production") {
          console.error("Slide content not found in carousel item");
        }
        throw new Error("Slide content not found");
      }

      if (process.env.NODE_ENV !== "production") {
        console.log("Found slide element:", slideElement);
      }

      await exportSlideToPng(currentPage, slideElement);
      toast({
        title: "Success",
        description: `Slide ${currentPage + 1} exported successfully`,
      });
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.error("Export failed:", error);
      }
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopyPng = async () => {
    setIsExporting(true);
    try {
      if (process.env.NODE_ENV !== "production") {
        console.log("Attempting to copy slide", currentPage);
      }

      // Find the slide element by its carousel item ID
      const carouselItem = document.getElementById(`carousel-item-${currentPage}`);
      if (!carouselItem) {
        if (process.env.NODE_ENV !== "production") {
          console.error("Carousel item not found:", `carousel-item-${currentPage}`);
        }
        throw new Error("Slide element not found");
      }

      if (process.env.NODE_ENV !== "production") {
        console.log("Found carousel item:", carouselItem);
      }

      // Find the actual slide content (PageBase element)
      const slideElement = carouselItem.querySelector('[id^="page-base-"]') as HTMLElement;
      if (!slideElement) {
        if (process.env.NODE_ENV !== "production") {
          console.error("Slide content not found in carousel item");
        }
        throw new Error("Slide content not found");
      }

      if (process.env.NODE_ENV !== "production") {
        console.log("Found slide element:", slideElement);
      }

      await copySlideToPng(slideElement);
      toast({
        title: "Success",
        description: "Slide copied to clipboard",
      });
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.error("Copy failed:", error);
      }
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div
      className={cn(
        "flex flex-row gap-0 bg-background rounded-t-md rounded-br-md rounded-bl-none px-1 border",
        className
      )}
    >
      <Button
        onClick={() => {
          swap(currentPage, currentPage - 1);
          setCurrentPage(currentPage - 1);
        }}
        variant="ghost"
        size="icon"
        className="w-8 h-8"
        disabled={currentPage <= 0 || currentPage > numPages - 1}
      >
        <ChevronLeft className="w-4 h-4" />
      </Button>
      <Button
        onClick={() => {
          if (process.env.NODE_ENV !== "production") {
            console.log({
              currentPage,
              pageValue: currentSlidesValues[currentPage],
            });
          }
          const insertPosition = currentPage;
          const values = JSON.parse(
            JSON.stringify(currentSlidesValues[insertPosition])
          );
          insert(insertPosition, values);
          // TODO A clone sets focus to an input and that resets current page back to `inserposition`
          setCurrentPage(insertPosition + 1);
        }}
        disabled={currentPage == 0 && numPages == 0}
        variant="ghost"
        className="w-8 h-8"
        size="icon"
      >
        <Copy className="w-4 h-4" />
      </Button>
      <Button
        onClick={() => {
          remove(currentPage);
          if (currentPage > 0) {
            // setNumPages(numPages - 1);
            setCurrentPage(currentPage - 1);
          } else if (currentPage == 0 && numPages > 0) {
            setCurrentPage(0);
          } else if (currentPage < 0 || currentPage >= numPages) {
            if (process.env.NODE_ENV !== "production") {
              console.error("Current page number not valid: ", currentPage);
            }
          }
        }}
        disabled={currentPage == 0 && numPages == 0}
        variant="ghost"
        className="w-8 h-8"
        size="icon"
      >
        <Trash className="w-4 h-4" />
      </Button>
      <Button
        onClick={() => {
          swap(currentPage, currentPage + 1);
          setCurrentPage(currentPage + 1);
        }}
        variant="ghost"
        className="w-8 h-8"
        size="icon"
        disabled={currentPage >= numPages - 1}
      >
        <ChevronRight className="w-4 h-4" />
      </Button>
      <div className="w-px h-8 bg-border mx-1" />
      <Button
        onClick={handleCopyPng}
        variant="ghost"
        className="w-8 h-8"
        size="icon"
        disabled={isExporting || (currentPage == 0 && numPages == 0)}
        title="Copy slide as PNG"
      >
        <Clipboard className="w-4 h-4" />
      </Button>
      <Button
        onClick={handleDownloadPng}
        variant="ghost"
        className="w-8 h-8"
        size="icon"
        disabled={isExporting || (currentPage == 0 && numPages == 0)}
        title="Download slide as PNG"
      >
        <Download className="w-4 h-4" />
      </Button>
    </div>
  );
}
