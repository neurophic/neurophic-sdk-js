export interface NeurophicOptions {
	apiKey?: string;
	baseURL?: string;
	timeout?: number;
}

export interface RequestOptions {
	signal?: AbortSignal;
}

export type MemoryTopic = "work" | "personal";

export interface IngestMetadata {
	topic?: MemoryTopic;
}

export interface IngestRequest {
	identifier?: string;
	name?: string;
	content: string;
	metadata?: IngestMetadata;
}

export interface IngestResponse {
	id: string;
	status: string;
}

export interface ContextRequest {
	identifier?: string;
	query: string;
}

export interface ContextResponse {
	result: string;
}

export type RetrieveFormat = "markdown" | "json";

export interface RetrieveRequest {
	identifier?: string;
	query: string;
	goal?: string;
	since?: string;
	limit?: number;
	format?: RetrieveFormat;
}

export interface RetrieveResponse {
	result: string;
}

export interface RetrievedMemory {
	id?: string;
	content: string;
	claimType: string;
	relevance: number;
	causedBy: string[];
	leadTo: string[];
	isPattern: boolean;
	confidence?: number;
	createdAt: string;
}

export interface RetrievedObservation {
	id: string;
	content: string;
	relevance: number;
	createdAt: string;
}

export interface RetrieveStructuredResponse {
	result: {
		memories: RetrievedMemory[];
		observations: RetrievedObservation[];
	};
}

export interface ListMemoriesRequest {
	identifier?: string;
	page?: number;
	perPage?: number;
}

export interface MemorySummary {
	id: string;
	content: string;
	phase: string;
	createdAt: string;
}

export interface ListMemoriesResponse {
	memories: MemorySummary[];
	page: number;
	perPage: number;
	total: number;
}

export interface GetMemoryRequest {
	identifier?: string;
}

export interface DeleteMemoryRequest {
	identifier?: string;
	restorePrevious?: boolean;
}

export interface ValidationDetail {
	field: string;
	message: string;
}
