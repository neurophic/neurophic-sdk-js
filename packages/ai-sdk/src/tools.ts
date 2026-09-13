import { tool } from "ai";
import { z } from "zod";
import type { NeurophicToolOptions } from "./types";

export function createTools(options: NeurophicToolOptions) {
	const { client, identifier, name } = options;

	const remember = tool({
		description: "Store information in long-term memory. Writes are queued, not stored instantly.",
		inputSchema: z.object({
			content: z.string().min(1).max(10_000).describe("The information to remember"),
			topic: z
				.enum(["work", "personal"])
				.optional()
				.describe("Optional topic used to categorise the memory"),
		}),
		execute: async ({ content, topic }) => {
			const { id, status } = await client.ingest({
				identifier,
				name,
				content,
				metadata: topic ? { topic } : undefined,
			});
			return { success: true, id, status };
		},
	});

	const recall = tool({
		description: "Search long-term memory for relevant information, returned as markdown.",
		inputSchema: z.object({
			query: z.string().min(1).max(2000).describe("What to search for"),
			goal: z
				.string()
				.max(500)
				.optional()
				.describe("Current goal or intent to influence relevance ranking"),
			since: z.iso
				.datetime({ offset: true })
				.or(z.iso.date())
				.optional()
				.describe("ISO 8601 date — only return memories after this date"),
			limit: z
				.number()
				.int()
				.min(1)
				.max(20)
				.optional()
				.describe("Maximum number of results (default 5)"),
		}),
		execute: async ({ query, goal, since, limit }) => {
			return client.retrieve({ identifier, query, goal, since, limit });
		},
	});

	return { remember, recall };
}
