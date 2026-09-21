import type { Metadata } from 'next';
import React from 'react';
import { LandingPage } from '@/src/page-views/landing-page';

export const metadata: Metadata = {
	title: {
		absolute: 'Финкнижка',
	},
	description:
		'Учёт личных финансов: счета, доходы, расходы и аналитика в одном месте.',
};

export default function PublicHomePage() {
	return <LandingPage />;
}
