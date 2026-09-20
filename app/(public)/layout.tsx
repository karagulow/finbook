import { PublicFooter } from '@/src/widgets/public-footer';
import { PublicNav } from '@/src/widgets/public-nav';

export default function PublicLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className='flex flex-col w-full'>
			<PublicNav />
			<main className='min-h-[100svh]'>{children}</main>
			<PublicFooter />
		</div>
	);
}
