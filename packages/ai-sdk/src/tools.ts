import { tool } from "ai";
import { z } from "zod";
import type { NeurophicToolOptions } from "./types";

export function createTools(options: NeurophicToolOptions) {
	const { client, identifier } = options;

	const remember = tool({
		description: "Store information in long-term memory.",
		inputSchema: z.object({
			content: z.string().describe("The information to remember"),
			metadata: z
				.record(z.string(), z.unknown())
				.optional()
				.describe("Optional key-value metadata to store alongside the memory"),
		}),
		execute: async ({ content, metadata }) => {
			await client.ingest({ identifier, content, metadata });
			return { success: true };
		},
	});

	const recall = tool({
		description: "Search long-term memory for relevant information with rich markdown output.",
		inputSchema: z.object({
			query: z.string().describe("What to search for"),
			goal: z.string().optional().describe("Current goal or intent to influence relevance ranking"),
			since: z.string().optional().describe("ISO 8601 date — only return memories after this date"),
			limit: z.number().min(1).max(20).optional().describe("Maximum number of results (default 5)"),
		}),
		execute: async ({ query, goal, since, limit }) => {
			return client.retrieve({ identifier, query, goal, since, limit });
		},
	});

	return { remember, recall };
}
