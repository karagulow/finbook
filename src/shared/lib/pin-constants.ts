export const PIN_LENGTH = 4;
export const PIN_OFFER_STORAGE_KEY = 'finbook-pin-offer';
export const PIN_MAX_ATTEMPTS = 5;
export const PIN_ENABLED_COOKIE = 'pinEnabled';
export const PIN_UNLOCK_COOKIE = 'pinUnlock';
export const PIN_WINDOW_COOKIE = 'pinWindow';

export const authCookieOptions = {
	httpOnly: true,
	secure: true,
	sameSite: 'strict' as const,
	path: '/',
};

export function isPin(value: unknown): value is string {
	return typeof value === 'string' && new RegExp(`^\\d{${PIN_LENGTH}}$`).test(value);
}

export function readRequestCookie(cookieHeader: string | null, name: string) {
	const cookies = cookieHeader ?? '';
	const item = cookies.split('; ').find(row => row.startsWith(`${name}=`));

	if (!item) {
		return undefined;
	}

	return item.slice(name.length + 1);
}

export function safeNextPath(value: string | null) {
	if (!value || !value.startsWith('/') || value.startsWith('//')) {
		return '/home';
	}

	if (
		value.startsWith('/login') ||
		value.startsWith('/lock') ||
		value.startsWith('/registration')
	) {
		return '/home';
	}

	return value;
}
