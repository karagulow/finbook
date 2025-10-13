import type { Metadata } from 'next';
import { Manrope } from 'next/font/google';
import './globals.css';
import Providers from '@/src/app/providers';
import { TopBlurOverlay } from '@/src/shared/ui';

const manropeSans = Manrope({
	variable: '--font-manrope-sans',
	subsets: ['latin', 'cyrillic'],
});

export const metadata: Metadata = {
	title: {
		default: 'Финкнижка',
		template: '%s | Финкнижка',
	},
	description:
		'PWA-приложение для учёта личных финансов: расходы, доходы, аналитика, цели и долги.',
	keywords: [
		'финансы',
		'расходы',
		'доходы',
		'аналитика',
		'цели',
		'долги',
		'PWA',
		'личный бюджет',
		'деньги',
		'учёт расходов',
		'приложение',
	],
	manifest: '/manifest.json',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='ru' suppressHydrationWarning>
			<body className={`${manropeSans.variable} antialiased`}>
				<Providers>
					<div className='bg-[var(--background-primary)]'>
						<TopBlurOverlay />

						{children}
					</div>
				</Providers>
			</body>
		</html>
	);
}
