# neurophic

TypeScript client for the [Neurophic](https://neurophic.ai) memory API. Zero dependencies, native `fetch`.

## Installation

```bash
npm install neurophic
```

## Usage

```typescript
import { Neurophic } from "neurophic";

// API key from constructor or NEUROPHIC_API_KEY env var
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

## Configuration

```typescript
const client = new Neurophic({
  apiKey: "nph_xxx", // Or set NEUROPHIC_API_KEY env var
  baseURL: "https://api.neurophic.ai", // Optional, default shown
  timeout: 30_000, // Optional, ms, default shown
});
```

Requests to cancel can be passed an `AbortSignal`:

```typescript
const controller = new AbortController();

await client.retrieve(
  { identifier: "user-123", query: "hobbies" },
  { signal: controller.signal },
);

// Cancel the request
controller.abort();
```

## Error Handling

```typescript
import { Neurophic, NeurophicError } from "neurophic";

try {
  await client.retrieve({ identifier: "user-123", query: "hobbies" });
} catch (error) {
  if (error instanceof NeurophicError) {
    console.error(error.status); // HTTP status code
    console.error(error.code); // API error code
    console.error(error.message); // Error message
  }
}
```

## License

MIT
