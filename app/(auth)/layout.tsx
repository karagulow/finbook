import type { Metadata } from 'next';
import {
	openGraphMetadata,
	siteConfig,
	twitterMetadata,
} from '@/src/shared/config/site';

export const metadata: Metadata = {
	openGraph: openGraphMetadata(siteConfig.description),
	twitter: twitterMetadata(siteConfig.description),
};

export default function AuthLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className='w-full h-[100svh] flex justify-center items-center bg-[var(--background-primary)]'>
			{children}
		</div>
	);
}
