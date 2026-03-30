# Neurophic SDK for JavaScript

TypeScript SDK for the [Neurophic](https://neurophic.ai) memory API.

## Packages

| Package | Description |
| --- | --- |
| [`neurophic`](./packages/neurophic) | Core REST client |
| [`@neurophic/ai-sdk`](./packages/ai-sdk) | Vercel AI SDK tools |

## Quick Start

### Core Client

```bash
npm install neurophic
```

```typescript
import { Neurophic } from "neurophic";

const client = new Neurophic({ apiKey: "nph_xxx" });

// Store a memory
await client.ingest({
  identifier: "user-123",
  content: "Loves hiking and photography",
});

// Retrieve memories
const { memories, observations } = await client.retrieve({
  identifier: "user-123",
  query: "hobbies",
});
```

### With Vercel AI SDK

```bash
npm install neurophic @neurophic/ai-sdk ai zod
```

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

## Development

```bash
pnpm install
pnpm build
```

## License

MIT
