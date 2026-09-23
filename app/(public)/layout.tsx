import { hasSession } from '@/src/shared/lib/has-session';
import { PublicFooter } from '@/src/widgets/public-footer';
import { PublicNav } from '@/src/widgets/public-nav';

export default async function PublicLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const authenticated = await hasSession();

	return (
		<div className='flex flex-col w-full'>
			<PublicNav authenticated={authenticated} />
			<main className='min-h-[100svh]'>{children}</main>
			<PublicFooter />
		</div>
	);
}
