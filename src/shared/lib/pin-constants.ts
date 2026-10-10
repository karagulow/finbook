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

export const HAS_SESSION_COOKIE = 'hasSession';
const SESSION_HINT_MAX_AGE = 30 * 24 * 60 * 60;

type SessionHintResponse = {
	cookies: {
		set: (
			name: string,
			value: string,
			options: {
				httpOnly: boolean;
				secure: boolean;
				sameSite: 'strict';
				path: string;
				maxAge: number;
			},
		) => void;
	};
};

export function applySessionHint<T extends SessionHintResponse>(
	response: T,
	active: boolean,
) {
	response.cookies.set(HAS_SESSION_COOKIE, active ? '1' : '', {
		httpOnly: false,
		secure: true,
		sameSite: 'strict',
		path: '/',
		maxAge: active ? SESSION_HINT_MAX_AGE : 0,
	});

	return response;
}

export const sessionHintScript = `(function () {
	var hasSession = document.cookie.split('; ').indexOf('${HAS_SESSION_COOKIE}=1') !== -1;
	document.documentElement.classList.toggle('has-session', hasSession);
})();`;

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
