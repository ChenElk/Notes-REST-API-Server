const OLLAMA_URL = process.env.OLLAMA_URL || "http://127.0.0.1:11434";
const AI_MODEL = process.env.AI_MODEL || "qwen2.5:3b";
const BACKEND_URL = process.env.BACKEND_URL || "http://127.0.0.1:3001";

const MAX_ROUND_TRIPS = 3;

type OllamaMessage = {
  role: "user" | "assistant" | "tool";
  content: string;
  tool_calls?: Array<{
    function: {
      name: string;
      arguments: string | { query?: string };
    };
  }>;
};

const tools = [
  {
    type: "function",
    function: {
      name: "filter_notes",
      description:
        "Search the notes collection by substring match on content. Returns up to 10 matches.",
      parameters: {
        type: "object",
        properties: {
          query: { type: "string" },
        },
        required: ["query"],
      },
    },
  },
];

export async function runAgent({
  prompt,
}: {
  prompt: string;
}): Promise<{ text: string }> {
  const messages: OllamaMessage[] = [
    {
      role: "user",
      content: prompt,
    },
  ];

  for (let i = 0; i < MAX_ROUND_TRIPS; i++) {
    let response: Response;

    try {
      response = await fetch(`${OLLAMA_URL}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: AI_MODEL,
          messages,
          tools,
          stream: false,
        }),
      });
    } catch {
      const err = new Error("Ollama is unreachable") as Error & {
        status?: number;
      };
      err.status = 502;
      throw err;
    }

    if (!response.ok) {
      const err = new Error("Ollama request failed") as Error & {
        status?: number;
      };
      err.status = 502;
      throw err;
    }

    const data = await response.json();
    const message = data.message as OllamaMessage;

    messages.push(message);

    if (!message.tool_calls?.length) {
      return { text: message.content ?? "" };
    }

    for (const call of message.tool_calls) {
      if (call.function.name !== "filter_notes") {
        continue;
      }

      const args =
        typeof call.function.arguments === "string"
          ? JSON.parse(call.function.arguments)
          : call.function.arguments;

      const query = args.query;

      if (typeof query !== "string" || query.trim() === "") {
        messages.push({
          role: "tool",
          content: JSON.stringify({ error: "missing query" }),
        });
        continue;
      }

      const notesResponse = await fetch(
        `${BACKEND_URL}/notes/filter?query=${encodeURIComponent(query)}`
      );

      const notesText = await notesResponse.text();

      messages.push({
        role: "tool",
        content: notesText,
      });
    }
  }

  const err = new Error("Agent exceeded round-trip cap") as Error & {
    status?: number;
  };
  err.status = 504;
  throw err;
}