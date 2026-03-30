export class NeurophicError extends Error {
	readonly status: number;
	readonly code: string;

	constructor(status: number, body: unknown) {
		const parsed = NeurophicError.parseBody(body);
		super(parsed.message);

		this.name = "NeurophicError";
		this.status = status;
		this.code = parsed.code;
	}

	static async fromResponse(response: Response): Promise<NeurophicError> {
		let body: unknown;
		try {
			body = await response.json();
		} catch {
			body = await response.text().catch(() => "Unknown error");
		}
		return new NeurophicError(response.status, body);
	}

	private static parseBody(body: unknown): { code: string; message: string } {
		if (
			typeof body === "object" &&
			body !== null &&
			"error" in body &&
			typeof body.error === "object" &&
			body.error !== null &&
			"code" in body.error &&
			"message" in body.error
		) {
			return {
				code: String(body.error.code),
				message: String(body.error.message),
			};
		}
		return { code: "unknown", message: String(body) };
	}
}
