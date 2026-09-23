import type { Metadata } from 'next';
import React from 'react';
import { LandingPage } from '@/src/page-views/landing-page';
import { hasSession } from '@/src/shared/lib/has-session';

export const metadata: Metadata = {
	title: {
		absolute: 'Финкнижка',
	},
	description:
		'Учёт личных финансов: счета, доходы, расходы и аналитика в одном месте.',
};

export default async function PublicHomePage() {
	const authenticated = await hasSession();

	return <LandingPage authenticated={authenticated} />;
}
