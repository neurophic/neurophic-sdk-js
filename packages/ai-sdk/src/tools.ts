import { tool } from "ai";
import { z } from "zod";
import type { NeurophicToolOptions } from "./types";

const isoDate = () => z.iso.datetime({ offset: true }).or(z.iso.date());

export function createTools(options: NeurophicToolOptions) {
	const { client, identifier, name, search } = options;

	const remember = tool({
		description: "Store information in long-term memory. Writes are queued, not stored instantly.",
		inputSchema: z.object({
			content: z.string().min(1).max(10_000).describe("The information to remember"),
		}),
		execute: async ({ content }) => {
			const { id, status } = await client.ingest({ identifier, name, content });
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
			since: isoDate().optional().describe("ISO 8601 date — only return memories after this date"),
			until: isoDate().optional().describe("ISO 8601 date — only return memories before this date"),
			limit: z
				.number()
				.int()
				.min(1)
				.max(20)
				.optional()
				.describe("Maximum number of results (default 10)"),
		}),
		execute: async ({ query, goal, since, until, limit }) => {
			return client.retrieve({ identifier, query, goal, since, until, limit, ...search });
		},
	});

	return { remember, recall };
}
