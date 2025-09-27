import { motion } from 'framer-motion';

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
	tabName,
}) => {
	return (
		<div className='relative w-full min-h-fit overflow-x-auto'>
			<div className='flex flex-row items-center justify-between gap-0.5 bg-[var(--muted)] border-[0.5px] border-[var(--border-primary)] rounded-[6px] p-0.5 w-full mx-auto'>
				{items.map((item, index) => {
					const isActive = activeItem === item;

					return (
						<button
							key={index}
							className='relative w-full py-1 font-semibold text-[13px] cursor-pointer group whitespace-nowrap'
							onClick={() => setActiveItem(item)}
						>
							{isActive && (
								<motion.div
									layoutId={`active-${tabName}`}
									className='absolute w-full inset-0 bg-[var(--button-secondary)] rounded-[4px] z-9'
									transition={{ type: 'spring', stiffness: 500, damping: 50 }}
								/>
							)}

							<span
								className={`relative z-9 transition group-hover:text-[var(--foreground-primary)] ${
									isActive
										? 'text-[var(--foreground-primary)]'
										: 'text-[var(--foreground-secondary)]'
								}`}
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
