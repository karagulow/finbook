import type { Metadata } from 'next';
import { LandingPage } from '@/src/page-views/landing-page';
import { siteConfig } from '@/src/shared/config/site';

export const metadata: Metadata = {
	title: {
		absolute: siteConfig.name,
	},
	description: siteConfig.publicDescription,
};

export default function PublicHomePage() {
	return <LandingPage />;
}
