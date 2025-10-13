import { ChatOpenAI } from "langchain/chat_models/openai";
import { DEFAULT_OPENROUTER_MODEL } from "@/lib/constants/openrouter";

export function createOpenRouterClient(
  apiKey: string,
  model: string = DEFAULT_OPENROUTER_MODEL
) {
  return new ChatOpenAI({
    openAIApiKey: apiKey,
    modelName: model,
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
