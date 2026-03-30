import { NeurophicError } from "./error";
import type {
	IngestRequest,
	IngestResponse,
	NeurophicOptions,
	RequestOptions,
	RetrieveRequest,
	RetrieveResponse,
} from "./types";

declare const __VERSION__: string;

const DEFAULT_BASE_URL = "https://api.neurophic.ai";
const DEFAULT_TIMEOUT = 30_000;
const API_VERSION = "v1";

export class Neurophic {
	private readonly apiKey: string;
	private readonly baseURL: string;
	private readonly timeout: number;

	constructor(options: NeurophicOptions = {}) {
		const apiKey = options.apiKey ?? process.env.NEUROPHIC_API_KEY;

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
		return this.post(`/${API_VERSION}/ingest`, request, options);
	}

	async retrieve(request: RetrieveRequest, options?: RequestOptions): Promise<RetrieveResponse> {
		return this.post(`/${API_VERSION}/retrieve`, request, options);
	}

	private async post<T>(path: string, body: unknown, options?: RequestOptions): Promise<T> {
		const response = await fetch(`${this.baseURL}${path}`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${this.apiKey}`,
				"User-Agent": `neurophic-js/${__VERSION__}`,
			},
			body: JSON.stringify(body),
			signal: this.createSignal(options?.signal),
		});

		if (!response.ok) {
			throw await NeurophicError.fromResponse(response);
		}

		return (await response.json()) as T;
	}

	private createSignal(userSignal?: AbortSignal): AbortSignal {
		const timeoutSignal = AbortSignal.timeout(this.timeout);
		if (!userSignal) {
			return timeoutSignal;
		}
		return AbortSignal.any([timeoutSignal, userSignal]);
	}
}
