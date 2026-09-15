import { UAParser } from 'ua-parser-js';

const CLIENT_HINT_HEADERS = [
	'user-agent',
	'sec-ch-ua',
	'sec-ch-ua-full-version-list',
	'sec-ch-ua-mobile',
	'sec-ch-ua-model',
	'sec-ch-ua-platform',
	'sec-ch-ua-platform-version',
	'sec-ch-ua-arch',
	'sec-ch-ua-bitness',
	'sec-ch-ua-form-factors',
] as const;

function clientHintHeaders(headers: Headers): Record<string, string> {
	const result: Record<string, string> = {};

	for (const name of CLIENT_HINT_HEADERS) {
		const value = headers.get(name);
		if (value) {
			result[name] = value;
		}
	}

	return result;
}

export async function getDeviceInfo(headers: Headers): Promise<string> {
	const parsed = new UAParser(clientHintHeaders(headers))
		.getResult()
		.withClientHints();
	const uaResult = parsed instanceof Promise ? await parsed : parsed;
	const browser = uaResult.browser.name ?? 'Unknown browser';
	const os = [uaResult.os.name, uaResult.os.version]
		.filter(Boolean)
		.join(' ');

	return os ? `${browser} on ${os}` : browser;
}
