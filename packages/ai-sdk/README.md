# @neurophic/ai-sdk

[Vercel AI SDK](https://sdk.vercel.ai) tools for [Neurophic](https://neurophic.ai) memory.

## Installation

```bash
npm install neurophic @neurophic/ai-sdk ai zod
```

## Usage

```typescript
import { Neurophic } from "neurophic";
import { createTools } from "@neurophic/ai-sdk";
import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";

const client = new Neurophic({ apiKey: "nph_xxx" });
const { remember, recall } = createTools({
  client,
  identifier: "user-123",
  search: { roles: ["user", "assistant"], sources: true, rerank: "fast" },
});

const result = streamText({
  model: openai("gpt-4o"),
  tools: { remember, recall },
  messages: [{ role: "user", content: "Remember that I love hiking" }],
});
```

## Tools

### `remember`

Stores information in long-term memory.

Parameters:
- `content` (string) — The information to remember

### `recall`

Searches long-term memory for relevant information.

Parameters:
- `query` (string) — What to search for
- `goal` (string, optional) — Current goal, used to rank relevance
- `since` (string, optional) — ISO 8601 date; only memories after it
- `until` (string, optional) — ISO 8601 date; only memories before it
- `limit` (number, optional) — Max results per role (1-20, default 10)

`createTools` also takes `search`, applied to every `recall` call:

- `roles` — whose words to return; the person's own by default, add `"assistant"` for what your agent said
- `sources` — also return the original turns, each once
- `rerank` — `"fast"` or `"thorough"`, a second ranking stage before the cut

## withContext

Returns a system prompt with the relevant memories appended, for when you want memory in front of the model on every turn without giving it a tool. Takes `query`, an optional `system` and `template`, and the same `roles`, `sources` and `rerank` as above.

```typescript
import { withContext } from "@neurophic/ai-sdk";

const system = await withContext(client, {
  identifier: "user-123",
  query: userMessage,
  system: "You are a travel assistant.",
  sources: true,
});
```

## License

MIT
