import type { Metadata } from 'next';
import React from 'react';
import { LandingPage } from '@/src/page-views/landing-page';
import {
	openGraphMetadata,
	siteConfig,
	twitterMetadata,
} from '@/src/shared/config/site';
import { hasSession } from '@/src/shared/lib/has-session';

export const metadata: Metadata = {
	title: {
		absolute: siteConfig.name,
	},
	description: siteConfig.publicDescription,
	openGraph: openGraphMetadata(siteConfig.publicDescription, '/'),
	twitter: twitterMetadata(siteConfig.publicDescription),
};

export default async function PublicHomePage() {
	const authenticated = await hasSession();

	return <LandingPage authenticated={authenticated} />;
}
