import { Menu } from '@/src/widgets/menu';
import { Tabbar } from '@/src/widgets/tabbar';

export default function UserLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className='flex flex-row gap-[30px] w-full max-w-[1440px] min-h-screen mx-auto px-4 sm:px-5 '>
			<Menu />
			<Tabbar />
			<div className='py-5 mt-10 mb-14 lg:mt-0 lg:mb-0 flex-1 min-w-0'>
				{children}
			</div>
		</div>
	);
}
