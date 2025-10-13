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

export const viewport = {
	width: 'device-width',
	initialScale: 1,
	maximumScale: 1,
	userScalable: false,
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='ru' suppressHydrationWarning>
			<head>
				<link rel='manifest' href='/manifest.json' />
				<link rel='apple-touch-icon' href='/icons/icon-192x192.png' />
				<meta name='apple-mobile-web-app-capable' content='yes' />
				<meta
					name='apple-mobile-web-app-status-bar-style'
					content='black-translucent'
				/>
				<meta
					name='viewport'
					content='width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no'
				/>
			</head>
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
