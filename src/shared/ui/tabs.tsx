import { cn } from '../lib';

interface TabsProps {
	items: string[];
	activeItem: string;
	setActiveItem: (item: string) => void;
	tabName: string;
}

export const Tabs: React.FC<TabsProps> = ({
	items,
	activeItem,
	setActiveItem,
}) => {
	const activeIndex = items.indexOf(activeItem);

	return (
		<div className='relative w-full min-h-fit overflow-x-auto'>
			<div className='relative flex bg-[var(--muted)] border-[0.5px] border-[var(--border-primary)] rounded-[6px] p-0.5 w-full mx-auto'>
				<div
					className='absolute top-0 left-0 h-[calc(100%-4px)] m-0.5 bg-[var(--button-secondary)] rounded-[4px] transition-all duration-300'
					style={{
						width: `calc(${100 / items.length}% - 4px)`,
						transform: `translateX(calc(${activeIndex * 100}% + ${
							activeIndex * 4
						}px))`,
					}}
				/>

				{items.map((item, index) => {
					const isActive = activeItem === item;

					return (
						<button
							key={index}
							className='relative w-full py-1 font-semibold text-[13px] cursor-pointer group whitespace-nowrap'
							onClick={() => setActiveItem(item)}
						>
							<span
								className={cn(
									'relative z-10 transition-colors duration-300',
									isActive
										? 'text-[var(--foreground-primary)]'
										: 'text-[var(--foreground-secondary)] group-hover:text-[var(--foreground-primary)]'
								)}
							>
								{item}
							</span>
						</button>
					);
				})}
			</div>
		</div>
	);
};
