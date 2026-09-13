import type { Neurophic } from "neurophic";
import type { WithContextOptions } from "./types";

const DEFAULT_TEMPLATE = (context: string, system?: string) => {
	const contextBlock = `## Context from memory\n${context}`;
	return system ? `${system}\n\n${contextBlock}` : contextBlock;
};

export async function withContext(client: Neurophic, options: WithContextOptions): Promise<string> {
	const { identifier, query, system, template = DEFAULT_TEMPLATE } = options;

	let result: string;
	try {
		({ result } = await client.context({ identifier, query }));
	} catch {
		return system ?? "";
	}

	if (!result) {
		return system ?? "";
	}

	return template(result, system);
}
