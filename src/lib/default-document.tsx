import * as z from "zod";
import { MultiSlideSchema } from "@/lib/validation/slide-schema";
import { SlideType } from "@/lib/validation/slide-schema";

import { getDefaultSlideOfType } from "@/lib/default-slides";
import {
  DEFAULT_BACKGROUND_IMAGE_INPUT,
  DEFAULT_IMAGE_INPUT,
} from "@/lib/validation/image-schema";

const defaultSlideValues: z.infer<typeof MultiSlideSchema> = [
  getDefaultSlideOfType(SlideType.enum.Intro),
  getDefaultSlideOfType(SlideType.enum.Common),
  getDefaultSlideOfType(SlideType.enum.Content),
  getDefaultSlideOfType(SlideType.enum.Content),
  getDefaultSlideOfType(SlideType.enum.Outro),
];

export const defaultValues = {
  slides: defaultSlideValues,
  config: {
    brand: {
      avatar: DEFAULT_IMAGE_INPUT,

      name: "My name",
      handle: "@name",
    },
    theme: {
      isCustom: true,
      pallette: "starryNight",
      primary: "#ffffff",
      secondary: "#e0e0e0",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      backgroundPattern: "starryNight",
      overlayPattern: "stars",
      backgroundImage: DEFAULT_BACKGROUND_IMAGE_INPUT,
    },
    fonts: {
      font1: "Montserrat",
      font2: "Open_Sans",
    },
    pageNumber: {
      showNumbers: true,
    },
  },
  filename: "My Carousel File",
};
