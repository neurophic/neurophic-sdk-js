import type { Neurophic } from "neurophic";

export interface NeurophicToolOptions {
	client: Neurophic;
	identifier: string;
}

export interface WithContextOptions {
	identifier: string;
	query: string;
	system?: string;
	template?: (context: string, system?: string) => string;
}
