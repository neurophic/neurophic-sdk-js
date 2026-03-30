export interface NeurophicOptions {
	apiKey?: string;
	baseURL?: string;
	timeout?: number;
}

export interface RequestOptions {
	signal?: AbortSignal;
}

export interface IngestRequest {
	identifier: string;
	content: string;
}

export interface IngestResponse {
	status: string;
}

export interface RetrieveRequest {
	identifier: string;
	query: string;
	limit?: number;
}

export interface Memory {
	content: string;
	claimType: string;
	relevance: number;
	causedBy: string[];
	leadTo: string[];
	isPattern: boolean;
	confidence?: number;
}

export interface Observation {
	content: string;
	relevance: number;
}

export interface RetrieveResponse {
	memories: Memory[];
	observations: Observation[];
}
