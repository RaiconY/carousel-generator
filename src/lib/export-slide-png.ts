import { toPng } from "html-to-image";

/**
 * Filter function to exclude elements that should not be exported
 * Excludes: add element buttons, hover effects, dialogs, etc.
 */
function shouldExportNode(node: Node): boolean {
  // Only filter Element nodes
  if (!(node instanceof Element)) {
    return true;
  }

  const element = node as Element;

  // Exclude add element buttons by ID
  if (element.id && element.id.startsWith("add-element-")) {
    return false;
  }

  // Exclude any dialogs or popovers that might be open
  if (element.getAttribute("role") === "dialog") {
    return false;
  }

  // Exclude buttons with dashed borders (add buttons)
  if (element.classList && element.classList.contains("border-dashed")) {
    return false;
  }

  return true;
}

export async function exportSlideToPng(
  slideIndex: number,
  slideElement: HTMLElement
): Promise<void> {
  try {
    if (!slideElement) {
      throw new Error("Slide element not found");
    }

    if (process.env.NODE_ENV !== "production") {
      console.log("Starting PNG export for slide", slideIndex, slideElement);
    }

    // Generate PNG data URL
    const dataUrl = await toPng(slideElement, {
      quality: 1.0,
      pixelRatio: 2, // Higher quality for retina displays
      filter: shouldExportNode,
      cacheBust: true,
    });

    if (process.env.NODE_ENV !== "production") {
      console.log("PNG generated successfully");
    }

    // Create download link
    const link = document.createElement("a");
    link.download = `slide-${slideIndex + 1}.png`;
    link.href = dataUrl;
    link.click();
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Error exporting slide to PNG:", error);
    }
    throw new Error(
      `Failed to export slide: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

export async function copySlideToPng(
  slideElement: HTMLElement
): Promise<void> {
  try {
    if (!slideElement) {
      throw new Error("Slide element not found");
    }

    if (process.env.NODE_ENV !== "production") {
      console.log("Starting PNG copy to clipboard", slideElement);
    }

    // Check if Clipboard API is supported
    if (!navigator.clipboard || !window.ClipboardItem) {
      throw new Error("Clipboard API not supported in your browser");
    }

    // Generate PNG blob
    const dataUrl = await toPng(slideElement, {
      quality: 1.0,
      pixelRatio: 2,
      filter: shouldExportNode,
      cacheBust: true,
    });

    if (process.env.NODE_ENV !== "production") {
      console.log("PNG generated successfully");
    }

    // Convert data URL to blob
    const response = await fetch(dataUrl);
    const blob = await response.blob();

    if (process.env.NODE_ENV !== "production") {
      console.log("Copying to clipboard", blob);
    }

    // Copy to clipboard using Clipboard API
    await navigator.clipboard.write([
      new ClipboardItem({
        "image/png": blob,
      }),
    ]);

    if (process.env.NODE_ENV !== "production") {
      console.log("Copied to clipboard successfully");
    }
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Error copying slide to clipboard:", error);
    }
    throw new Error(
      `Failed to copy slide: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}
