export interface NeurophicOptions {
	apiKey?: string;
	baseURL?: string;
	timeout?: number;
}

export interface RequestOptions {
	signal?: AbortSignal;
}

/** @deprecated Accepted and ignored since 0.5.0: `topic` no longer affects patterns. */
export type MemoryTopic = "work" | "personal";

/** @deprecated Accepted and ignored since 0.5.0: `topic` no longer affects patterns. */
export interface IngestMetadata {
	topic?: MemoryTopic;
}

export type MemoryRole = "user" | "assistant";

export type RerankMode = "none" | "fast" | "thorough";

export interface IngestRequest {
	identifier: string;
	name?: string;
	content: string;
	occurredAt?: string | Date;
	role?: MemoryRole;
	/** @deprecated Accepted and ignored since 0.5.0: `topic` no longer affects patterns. */
	metadata?: IngestMetadata;
}

export interface IngestResponse {
	id: string;
	status: string;
}

export interface ContextRequest {
	identifier: string;
	query: string;
	roles?: MemoryRole[];
	sources?: boolean;
	rerank?: RerankMode;
}

export interface ContextResponse {
	result: string;
}

export type RetrieveFormat = "markdown" | "json";

export interface RetrieveRequest {
	identifier: string;
	query: string;
	goal?: string;
	since?: string | Date;
	until?: string | Date;
	roles?: MemoryRole[];
	limit?: number;
	referenceDate?: string | Date;
	format?: RetrieveFormat;
	sources?: boolean;
	rerank?: RerankMode;
}

export interface RetrieveResponse {
	result: string;
}

export interface RetrievedMemory {
	id: string;
	content: string;
	claimType: string;
	relevance?: number;
	causedBy: string[];
	leadTo: string[];
	createdAt: string;
	occurredAt: string;
	eventDate?: string;
	role: MemoryRole;
	sourceId?: string;
}

export interface RetrievedObservation {
	id: string;
	content: string;
	relevance?: number;
	createdAt: string;
	occurredAt: string;
	role: MemoryRole;
}

export interface RetrievedPattern {
	content: string;
	claimType: string;
	confidence: number;
	relevance?: number;
	createdAt: string;
	updatedAt: string;
}

export interface RetrievedSource {
	id: string;
	role: MemoryRole;
	content: string;
	occurredAt: string;
}

export interface RetrieveStructuredResponse {
	result: {
		memories: RetrievedMemory[];
		observations: RetrievedObservation[];
		patterns: RetrievedPattern[];
		sources: RetrievedSource[];
	};
}

export interface ListMemoriesRequest {
	identifier: string;
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
	identifier: string;
}

export interface DeleteMemoryRequest {
	identifier: string;
	restorePrevious?: boolean;
}

export interface ValidationDetail {
	field: string;
	message: string;
}
