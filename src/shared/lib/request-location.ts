const PRIVATE_IP_PATTERNS = [
	/^127\./,
	/^10\./,
	/^192\.168\./,
	/^172\.(1[6-9]|2\d|3[0-1])\./,
	/^::1$/,
	/^fc00:/i,
	/^fe80:/i,
	/^localhost$/i,
];

const countryNames = new Intl.DisplayNames(['en'], { type: 'region' });

function isPrivateIp(ip: string): boolean {
	return PRIVATE_IP_PATTERNS.some(pattern => pattern.test(ip));
}

function getClientIp(headers: Headers): string | null {
	const forwardedFor = headers.get('x-forwarded-for');
	const forwarded = headers.get('forwarded');
	const forwardedIp = forwarded?.match(/for="?\[?([^\]";,\s]+)/i)?.[1];

	const candidates = [
		headers.get('cf-connecting-ip'),
		headers.get('true-client-ip'),
		headers.get('x-real-ip'),
		headers.get('x-vercel-forwarded-for'),
		headers.get('x-client-ip'),
		forwardedFor?.split(',')[0],
		forwardedIp,
	];

	for (const candidate of candidates) {
		const ip = candidate?.trim().replace(/^::ffff:/, '').replace(/^\[|\]$/g, '');
		if (ip) {
			return ip;
		}
	}

	return null;
}

function formatLocation(city?: string | null, country?: string | null): string | null {
	const parts = [city?.trim(), country?.trim()].filter(Boolean);
	return parts.length ? parts.join(', ') : null;
}

function countryFromCode(code?: string | null): string | null {
	if (!code || code.length !== 2) {
		return null;
	}

	try {
		return countryNames.of(code.toUpperCase()) ?? code;
	} catch {
		return code;
	}
}

function locationFromVercelHeaders(headers: Headers): string | null {
	const rawCity = headers.get('x-vercel-ip-city');
	const city = rawCity ? decodeURIComponent(rawCity) : null;
	const country = countryFromCode(headers.get('x-vercel-ip-country'));

	return formatLocation(city, country);
}

function sanitizeClientLocation(value: string | null): string | null {
	if (!value) {
		return null;
	}

	const trimmed = value.trim().slice(0, 80);
	if (!/^[\p{L}\p{N}\s.,()\-']+$/u.test(trimmed)) {
		return null;
	}

	return trimmed;
}

async function lookupGeo(ip?: string | null): Promise<string | null> {
	const url = ip
		? `https://ipwho.is/${encodeURIComponent(ip)}?fields=success,city,country`
		: 'https://ipwho.is/?fields=success,city,country';

	try {
		const response = await fetch(url, {
			cache: 'no-store',
			signal: AbortSignal.timeout(4000),
		});

		if (!response.ok) {
			return null;
		}

		const data = (await response.json()) as {
			success?: boolean;
			city?: string;
			country?: string;
		};

		if (!data.success) {
			return null;
		}

		return formatLocation(data.city, data.country);
	} catch {
		return null;
	}
}

export async function getRequestLocation(
	headers: Headers
): Promise<string | null> {
	const fromPlatform = locationFromVercelHeaders(headers);
	if (fromPlatform) {
		return fromPlatform;
	}

	const ip = getClientIp(headers);
	if (ip && !isPrivateIp(ip)) {
		const fromIp = await lookupGeo(ip);
		if (fromIp) {
			return fromIp;
		}
	}

	const fromEgress = await lookupGeo();
	if (fromEgress) {
		return fromEgress;
	}

	return sanitizeClientLocation(headers.get('x-client-location'));
}
