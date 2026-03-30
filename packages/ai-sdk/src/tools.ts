import { tool } from "ai";
import { z } from "zod";
import type { NeurophicToolOptions } from "./types";

export function createTools(options: NeurophicToolOptions) {
	const { client, identifier } = options;

	const remember = tool({
		description: "Store information in long-term memory.",
		parameters: z.object({
			content: z.string().describe("The information to remember"),
		}),
		execute: async ({ content }) => {
			return client.ingest({ identifier, content });
		},
	});

	const recall = tool({
		description: "Search long-term memory for relevant information.",
		parameters: z.object({
			query: z.string().describe("What to search for"),
			limit: z.number().min(1).max(20).optional(),
		}),
		execute: async ({ query, limit }) => {
			return client.retrieve({ identifier, query, limit });
		},
	});

	return { remember, recall };
}
