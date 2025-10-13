import { ChatOpenAI } from "langchain/chat_models/openai";

export function createOpenRouterClient(apiKey: string, model?: string) {
  return new ChatOpenAI({
    openAIApiKey: apiKey,
    modelName: model || "anthropic/claude-3.5-sonnet",
    temperature: 0,
    configuration: {
      baseURL: "https://openrouter.ai/api/v1",
      defaultHeaders: {
        "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL,
        "X-Title": "Instagram Carousel Generator",
      },
    },
  });
}
