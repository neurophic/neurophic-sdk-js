import { NeurophicConnectionError, NeurophicError, NeurophicTimeoutError } from "./error";
import type {
	ContextRequest,
	ContextResponse,
	DeleteMemoryRequest,
	GetMemoryRequest,
	IngestRequest,
	IngestResponse,
	ListMemoriesRequest,
	ListMemoriesResponse,
	MemorySummary,
	NeurophicOptions,
	RequestOptions,
	RetrieveRequest,
	RetrieveResponse,
	RetrieveStructuredResponse,
} from "./types";

declare const __VERSION__: string;

const DEFAULT_BASE_URL = "https://api.neurophic.ai";
const DEFAULT_TIMEOUT = 30_000;
const API_VERSION = "v1";

interface RequestPayload {
	body?: unknown;
	query?: Record<string, string | undefined>;
}

export class Neurophic {
	private readonly apiKey: string;
	private readonly baseURL: string;
	private readonly timeout: number;

	readonly memory = {
		list: (
			request: ListMemoriesRequest = {},
			options?: RequestOptions,
		): Promise<ListMemoriesResponse> =>
			this.request("POST", `/${API_VERSION}/memories/list`, { body: request }, options),

		get: (
			id: string,
			request: GetMemoryRequest = {},
			options?: RequestOptions,
		): Promise<MemorySummary> =>
			this.request(
				"GET",
				`/${API_VERSION}/memories/${encodeURIComponent(id)}`,
				{ query: { identifier: request.identifier } },
				options,
			),

		delete: (
			id: string,
			request: DeleteMemoryRequest = {},
			options?: RequestOptions,
		): Promise<void> =>
			this.request(
				"DELETE",
				`/${API_VERSION}/memories/${encodeURIComponent(id)}`,
				{
					query: {
						identifier: request.identifier,
						restorePrevious: request.restorePrevious ? "true" : undefined,
					},
				},
				options,
			),
	};

	constructor(options: NeurophicOptions = {}) {
		const apiKey =
			options.apiKey ??
			(typeof process === "undefined" ? undefined : process.env.NEUROPHIC_API_KEY);

		if (!apiKey) {
			throw new Error(
				"apiKey is required. Pass it to the constructor or set the NEUROPHIC_API_KEY environment variable.",
			);
		}

		this.apiKey = apiKey;
		this.baseURL = (options.baseURL ?? DEFAULT_BASE_URL).replace(/\/+$/, "");
		this.timeout = options.timeout ?? DEFAULT_TIMEOUT;
	}

	async ingest(request: IngestRequest, options?: RequestOptions): Promise<IngestResponse> {
		return this.request("POST", `/${API_VERSION}/ingest`, { body: request }, options);
	}

	async context(request: ContextRequest, options?: RequestOptions): Promise<ContextResponse> {
		return this.request("POST", `/${API_VERSION}/context`, { body: request }, options);
	}

	async retrieve(
		request: RetrieveRequest & { format: "json" },
		options?: RequestOptions,
	): Promise<RetrieveStructuredResponse>;
	async retrieve(
		request: RetrieveRequest & { format?: "markdown" },
		options?: RequestOptions,
	): Promise<RetrieveResponse>;
	async retrieve(
		request: RetrieveRequest,
		options?: RequestOptions,
	): Promise<RetrieveResponse | RetrieveStructuredResponse>;
	async retrieve(
		request: RetrieveRequest,
		options?: RequestOptions,
	): Promise<RetrieveResponse | RetrieveStructuredResponse> {
		return this.request("POST", `/${API_VERSION}/retrieve`, { body: request }, options);
	}

	private async request<T>(
		method: string,
		path: string,
		payload: RequestPayload,
		options?: RequestOptions,
	): Promise<T> {
		const headers: Record<string, string> = {
			Authorization: `Bearer ${this.apiKey}`,
			"User-Agent": `neurophic-js/${__VERSION__}`,
		};

		if (payload.body !== undefined) {
			headers["Content-Type"] = "application/json";
		}

		let response: Response;
		try {
			response = await fetch(this.buildURL(path, payload.query), {
				method,
				headers,
				body: payload.body !== undefined ? JSON.stringify(payload.body) : undefined,
				signal: this.createSignal(options?.signal),
			});
		} catch (error) {
			throw this.wrapFetchError(error);
		}

		if (!response.ok) {
			throw await NeurophicError.fromResponse(response);
		}

		if (response.status === 204) {
			return undefined as T;
		}

		return (await response.json()) as T;
	}

	private buildURL(path: string, query?: Record<string, string | undefined>): string {
		const url = `${this.baseURL}${path}`;
		if (!query) {
			return url;
		}

		const params = new URLSearchParams();
		for (const [key, value] of Object.entries(query)) {
			if (value !== undefined) {
				params.set(key, value);
			}
		}

		const search = params.toString();
		return search ? `${url}?${search}` : url;
	}

	private wrapFetchError(error: unknown): unknown {
		if (error instanceof DOMException && error.name === "TimeoutError") {
			return new NeurophicTimeoutError(this.timeout);
		}
		if (error instanceof TypeError) {
			return new NeurophicConnectionError(error);
		}
		return error;
	}

	private createSignal(userSignal?: AbortSignal): AbortSignal {
		const timeoutSignal = AbortSignal.timeout(this.timeout);
		if (!userSignal) {
			return timeoutSignal;
		}
		return AbortSignal.any([timeoutSignal, userSignal]);
	}
}
