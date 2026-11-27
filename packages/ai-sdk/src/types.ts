import type { MemoryRole, Neurophic, RerankMode } from "neurophic";

export interface SearchOptions {
	roles?: MemoryRole[];
	sources?: boolean;
	rerank?: RerankMode;
}

export interface NeurophicToolOptions {
	client: Neurophic;
	identifier: string;
	name?: string;
	search?: SearchOptions;
}

export interface WithContextOptions extends SearchOptions {
	identifier: string;
	query: string;
	system?: string;
	template?: (context: string, system?: string) => string;
}
