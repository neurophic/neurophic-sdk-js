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
- `limit` (number, optional) — Max results (1-20)

## License

MIT
