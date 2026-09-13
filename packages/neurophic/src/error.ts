import type { ValidationDetail } from "./types";

export const NeurophicErrorCodes = {
	UNAUTHORIZED: "UNAUTHORIZED",
	VALIDATION_ERROR: "VALIDATION_ERROR",
	NOT_FOUND: "NOT_FOUND",
	POLICY_ACCEPTANCE_REQUIRED: "POLICY_ACCEPTANCE_REQUIRED",
	SUBSCRIPTION_REQUIRED: "SUBSCRIPTION_REQUIRED",
	PROJECT_SUSPENDED: "PROJECT_SUSPENDED",
	INSUFFICIENT_CREDIT: "INSUFFICIENT_CREDIT",
	MEMORY_LIMIT_REACHED: "MEMORY_LIMIT_REACHED",
	WRITE_LIMIT_REACHED: "WRITE_LIMIT_REACHED",
	REQUEST_LIMIT_REACHED: "REQUEST_LIMIT_REACHED",
	SERVICE_UNAVAILABLE: "SERVICE_UNAVAILABLE",
	INTERNAL_ERROR: "INTERNAL_ERROR",
} as const;

export type NeurophicErrorCode = (typeof NeurophicErrorCodes)[keyof typeof NeurophicErrorCodes];

interface ParsedErrorBody {
	code: string;
	message: string;
	details?: ValidationDetail[];
}

export class NeurophicError extends Error {
	readonly status: number;
	readonly code: NeurophicErrorCode | (string & {});
	readonly details?: ValidationDetail[];
	readonly body: unknown;

	constructor(status: number, body: unknown) {
		const parsed = NeurophicError.parseBody(status, body);
		super(parsed.message);

		this.name = "NeurophicError";
		this.status = status;
		this.code = parsed.code;
		this.details = parsed.details;
		this.body = body;
	}

	static async fromResponse(response: Response): Promise<NeurophicError> {
		const text = await response.text().catch(() => "");
		let body: unknown = text;
		try {
			body = JSON.parse(text);
		} catch {}

		return new NeurophicError(response.status, body);
	}

	private static parseBody(status: number, body: unknown): ParsedErrorBody {
		if (
			typeof body === "object" &&
			body !== null &&
			"error" in body &&
			typeof body.error === "object" &&
			body.error !== null &&
			"code" in body.error &&
			"message" in body.error
		) {
			const { error } = body;
			return {
				code: String(error.code),
				message: String(error.message),
				details: NeurophicError.parseDetails(error),
			};
		}

		if (typeof body === "string" && body.length > 0) {
			return { code: "UNKNOWN", message: body.slice(0, 200) };
		}

		if (typeof body === "object" && body !== null) {
			return { code: "UNKNOWN", message: JSON.stringify(body).slice(0, 200) };
		}

		return { code: "UNKNOWN", message: `HTTP ${status} error` };
	}

	private static parseDetails(error: object): ValidationDetail[] | undefined {
		if (!("details" in error) || !Array.isArray(error.details)) {
			return undefined;
		}

		const details = error.details.filter(
			(item): item is ValidationDetail =>
				typeof item === "object" &&
				item !== null &&
				"field" in item &&
				"message" in item &&
				typeof item.field === "string" &&
				typeof item.message === "string",
		);

		return details.length > 0 ? details : undefined;
	}
}

export class NeurophicTimeoutError extends NeurophicError {
	constructor(timeout: number) {
		super(0, { error: { code: "TIMEOUT", message: `Request timed out after ${timeout}ms.` } });
		this.name = "NeurophicTimeoutError";
	}
}

export class NeurophicConnectionError extends NeurophicError {
	readonly cause: unknown;

	constructor(cause: unknown) {
		super(0, {
			error: { code: "CONNECTION_ERROR", message: "Failed to connect to the Neurophic API." },
		});
		this.name = "NeurophicConnectionError";
		this.cause = cause;
	}
}
