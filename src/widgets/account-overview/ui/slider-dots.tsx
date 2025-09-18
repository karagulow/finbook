import React from 'react';

interface Props {
	totalItems: number;
	itemsPerView: number;
	currentIndex: number;
	goTo: (index: number) => void;
}

export const SliderDots: React.FC<Props> = ({
	totalItems,
	itemsPerView,
	currentIndex,
	goTo,
}) => {
	if (totalItems <= itemsPerView) return null;

	const pageCount = totalItems - itemsPerView + 1;

	return (
		<div className='flex justify-center gap-1'>
			{Array.from({ length: pageCount }).map((_, pageIndex) => (
				<button
					key={pageIndex}
					onClick={() => goTo(pageIndex)}
					className={`h-2.5 rounded-full bg-[var(--button-tertiary)] hover:bg-[var(--button-secondary)] transition-all duration-400 ease-out ${
						pageIndex === currentIndex ? 'w-7' : 'w-2.5'
					}`}
					aria-label={`Перейти к слайду ${pageIndex + 1}`}
				/>
			))}
		</div>
	);
};
