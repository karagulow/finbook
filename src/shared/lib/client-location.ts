let cachedLocation: string | null | undefined;

function formatLocation(city?: string | null, country?: string | null): string | null {
	const parts = [city?.trim(), country?.trim()].filter(Boolean);
	return parts.length ? parts.join(', ') : null;
}

export async function getClientLocation(): Promise<string | null> {
	if (typeof window === 'undefined') {
		return null;
	}

	if (cachedLocation !== undefined) {
		return cachedLocation;
	}

	try {
		const response = await fetch(
			'https://ipwho.is/?fields=success,city,country',
			{ signal: AbortSignal.timeout(4000) }
		);

		if (!response.ok) {
			cachedLocation = null;
			return cachedLocation;
		}

		const data = (await response.json()) as {
			success?: boolean;
			city?: string;
			country?: string;
		};

		cachedLocation = data.success
			? formatLocation(data.city, data.country)
			: null;
	} catch {
		cachedLocation = null;
	}

	return cachedLocation;
}
