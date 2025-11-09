"use client";

import { designTemplates, backgroundPatterns, overlayPatterns } from "@/lib/background-patterns";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { DocumentFormReturn } from "@/lib/document-form-types";
import { useFormContext } from "react-hook-form";

export function DesignTemplateSelector() {
  const form: DocumentFormReturn = useFormContext();
  const { setValue } = form;

  const applyTemplate = (templateId: string) => {
    const template = designTemplates.find(t => t.id === templateId);
    if (!template) return;

    const bgPattern = backgroundPatterns[template.backgroundPattern];

    // Применяем все настройки из шаблона
    setValue("config.theme.background", bgPattern.value);
    setValue("config.theme.primary", template.primaryColor);
    setValue("config.theme.secondary", template.secondaryColor);
    setValue("config.theme.isCustom", true);
    setValue("config.theme.backgroundPattern", template.backgroundPattern);
    setValue("config.theme.overlayPattern", template.overlayPattern);

    // Применяем шрифты из шаблона
    setValue("config.fonts.font1", template.font1);
    setValue("config.fonts.font2", template.font2);
  };

  return (
    <div className="space-y-6 w-full">
      <div>
        <h3 className="text-base font-semibold mb-1">Готовые дизайны</h3>
        <p className="text-xs text-muted-foreground mb-4">
          Выберите предзаготовленный дизайн
        </p>
      </div>

      <div className="flex flex-col gap-3 w-full">
        {designTemplates.map((template) => {
          const bgPattern = backgroundPatterns[template.backgroundPattern];
          const overlay = template.overlayPattern ? overlayPatterns[template.overlayPattern as keyof typeof overlayPatterns] : null;

          return (
            <Card
              key={template.id}
              className="cursor-pointer hover:ring-2 hover:ring-primary transition-all w-full max-h-[100px]"
              onClick={() => applyTemplate(template.id)}
            >
              <CardContent className="p-2 flex items-center gap-2">
                <div
                  className="w-16 h-16 rounded-md relative overflow-hidden flex-shrink-0"
                  style={{
                    background: bgPattern.value,
                    backgroundImage: overlay ? `url("${overlay.svg}")` : undefined,
                    backgroundSize: overlay ? 'auto' : undefined,
                    backgroundRepeat: overlay ? 'repeat' : undefined,
                  }}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl">{template.preview}</span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm mb-0.5 truncate">{template.name}</h4>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {template.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="mt-6 pt-6 border-t">
        <h3 className="text-base font-semibold mb-1">Градиенты</h3>
        <p className="text-xs text-muted-foreground mb-4">
          Выберите отдельный градиент
        </p>

        <div className="grid grid-cols-2 gap-2">
          {Object.entries(backgroundPatterns).map(([key, pattern]) => (
            <div
              key={key}
              className="cursor-pointer hover:scale-105 transition-transform"
              onClick={() => {
                setValue("config.theme.background", pattern.value);
                setValue("config.theme.isCustom", true);
              }}
            >
              <div
                className="w-full h-16 rounded-md mb-1.5 border"
                style={{
                  background: pattern.value,
                }}
              >
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-xl">{pattern.preview}</span>
                </div>
              </div>
              <p className="text-[10px] text-center font-medium leading-tight">
                {pattern.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
