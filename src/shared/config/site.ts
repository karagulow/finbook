import type { Metadata } from 'next';

const LOCAL_SITE_URL = 'http://localhost:3000';

export function getSiteUrl() {
	const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, '');
	if (explicit) return explicit;

	const productionHost = process.env.VERCEL_PROJECT_PRODUCTION_URL;
	const deploymentHost = process.env.VERCEL_URL;

	if (process.env.VERCEL_ENV === 'production' && productionHost) {
		return `https://${productionHost}`;
	}

	if (deploymentHost) return `https://${deploymentHost}`;
	if (productionHost) return `https://${productionHost}`;

	return LOCAL_SITE_URL;
}

export const siteConfig = {
	name: 'Финкнижка',
	description:
		'Приложение для учёта личных финансов: счета, доходы, расходы, аналитика, цели и долги.',
	publicDescription:
		'Начните лучше понимать свои финансы. Счета, доходы, расходы и аналитика — в одном приложении.',
} as const;

export function openGraphMetadata(
	description: string,
	url: string = getSiteUrl(),
): Metadata['openGraph'] {
	return {
		type: 'website',
		locale: 'ru_RU',
		siteName: siteConfig.name,
		title: siteConfig.name,
		description,
		url,
	};
}

export function twitterMetadata(description: string): Metadata['twitter'] {
	return {
		card: 'summary_large_image',
		title: siteConfig.name,
		description,
	};
}
