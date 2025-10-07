import React from 'react';
import { DeleteButton, EditButton } from '@/src/shared/ui';

interface Props {
	category: {
		id: string;
		name: string;
		icon: string | null;
		subcategories: { id: string; name: string }[];
	};
}

export const CategoryItem: React.FC<Props> = ({ category }) => {
	return (
		<li className='flex flex-col gap-2.5 items-start p-2.5 w-full bg-[var(--muted)] rounded-[6px]'>
			<div className='flex flex-row items-center justify-between gap-2.5 w-full'>
				<div className='flex flex-row items-center gap-2.5'>
					<div className='flex items-center justify-center size-10 border-[0.5px] border-[var(--border-primary)] bg-[var(--card)] rounded-[6px] flex-shrink-0 text-[20px]'>
						{category.icon}
					</div>
					<div className='flex flex-col gap-0.5'>
						<span className='font-medium text-[15px] text-[var(--foreground-primary)]'>
							{category.name}
						</span>
						<span className='font-medium text-[13px] text-[var(--foreground-secondary)]'>
							{category.subcategories.length > 0
								? `Подкатегории: ${category.subcategories.length}`
								: 'Нет подкатегорий'}
						</span>
					</div>
				</div>

				<div className='flex flex-row items-center gap-2.5'>
					<EditButton />
					<DeleteButton />
				</div>
			</div>

			<div className='flex flex-row gap-1.5 items-center overflow-auto w-full scroll-thin'>
				{category.subcategories.map(subcat => (
					<span
						className='px-2 py-1 bg-[var(--button-secondary)] rounded-[4px] font-semibold text-[11px] text-[var(--foreground-primary)] whitespace-nowrap'
						key={subcat.id}
					>
						{subcat.name}
					</span>
				))}
			</div>
		</li>
	);
};
