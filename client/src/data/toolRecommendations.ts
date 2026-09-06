export type TaskType = "Coding" | "Writing" | "Research" | "Design" | "Study";

export interface ToolRecommendation {
  name: string;
  bestFor: string;
  reason: string;
  accent: "signal" | "ember" | "mint";
  url: string;
}

export const taskTypes: TaskType[] = ["Coding", "Writing", "Research", "Design", "Study"];

export const toolRecommendations: Record<TaskType, ToolRecommendation[]> = {
  Coding: [
    { name: "Claude", bestFor: "Large code changes", reason: "Strong at reasoning across multiple files and explaining tradeoffs.", accent: "ember", url: "https://claude.ai" },
    { name: "ChatGPT", bestFor: "Debugging and learning", reason: "Useful for interactive debugging, examples, and step-by-step explanations.", accent: "signal", url: "https://chatgpt.com" },
    { name: "GitHub Copilot", bestFor: "In-editor momentum", reason: "Keeps suggestions close to the code while you work.", accent: "mint", url: "https://github.com/features/copilot" },
  ],
  Writing: [
    { name: "ChatGPT", bestFor: "Drafts and rewrites", reason: "Good for outlining, changing tone, and turning rough notes into clear copy.", accent: "signal", url: "https://chatgpt.com" },
    { name: "Claude", bestFor: "Long-form editing", reason: "Helpful when a document needs a careful, consistent editorial pass.", accent: "ember", url: "https://claude.ai" },
  ],
  Research: [
    { name: "Perplexity", bestFor: "Source-led discovery", reason: "Designed for web research with linked sources to follow up on.", accent: "mint", url: "https://www.perplexity.ai" },
    { name: "ChatGPT", bestFor: "Synthesis", reason: "Useful for comparing notes and turning findings into a structured brief.", accent: "signal", url: "https://chatgpt.com" },
  ],
  Design: [
    { name: "Figma AI", bestFor: "Interface exploration", reason: "Keeps ideation close to the canvas, components, and team comments.", accent: "ember", url: "https://www.figma.com" },
    { name: "ChatGPT", bestFor: "UX writing and flows", reason: "Good for naming, user flows, and testing alternative product language.", accent: "signal", url: "https://chatgpt.com" },
  ],
  Study: [
    { name: "ChatGPT", bestFor: "Tutoring and practice", reason: "Can explain a concept at your level and generate practice questions.", accent: "signal", url: "https://chatgpt.com" },
    { name: "Claude", bestFor: "Reading dense material", reason: "Useful for unpacking long notes and discussing them carefully.", accent: "ember", url: "https://claude.ai" },
  ],
};
