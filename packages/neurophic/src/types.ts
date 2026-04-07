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
	metadata?: Record<string, unknown>;
}

export interface ContextRequest {
	identifier: string;
	query: string;
}

export interface ContextResponse {
	result: string;
}

export interface RetrieveRequest {
	identifier: string;
	query: string;
	goal?: string;
	since?: string;
	limit?: number;
}

export interface RetrieveResponse {
	result: string;
}
