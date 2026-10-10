import type { Metadata, Viewport } from 'next';
import { Manrope } from 'next/font/google';
import './globals.css';
import Providers from '@/app/providers';
import {
	getSiteUrl,
	openGraphMetadata,
	siteConfig,
	twitterMetadata,
} from '@/src/shared/config/site';
import { sessionHintScript } from '@/src/shared/lib/pin-constants';
import {
	pwaEntryRedirectScript,
	pwaPinLockScript,
} from '@/src/shared/lib/pwa-entry-redirect';
import { SessionHintSync } from '@/src/shared/lib/session-hint-sync';
import { SplashScreen, Statusbar } from '@/src/shared/ui';

const manropeSans = Manrope({
	variable: '--font-manrope-sans',
	subsets: ['latin', 'cyrillic'],
});

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
	metadataBase: new URL(siteUrl),
	title: {
		default: siteConfig.name,
		template: `%s | ${siteConfig.name}`,
	},
	description: siteConfig.description,
	applicationName: siteConfig.name,
	openGraph: openGraphMetadata(),
	twitter: twitterMetadata(),
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

export const viewport: Viewport = {
	width: 'device-width',
	initialScale: 1,
	maximumScale: 1,
	userScalable: false,
	viewportFit: 'cover',
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
				<script dangerouslySetInnerHTML={{ __html: sessionHintScript }} />
				<script
					dangerouslySetInnerHTML={{ __html: pwaEntryRedirectScript }}
				/>
				<script
					dangerouslySetInnerHTML={{ __html: pwaPinLockScript }}
				/>
			</head>
			<body className={`${manropeSans.variable} antialiased`}>
				<SessionHintSync />
				<Statusbar />
				<Providers>
					<div className='bg-[var(--background-primary)] '>
						<SplashScreen />
						{children}
					</div>
				</Providers>
			</body>
		</html>
	);
}
