import { useState, useCallback, useEffect } from 'react';

interface Accounts {
	id: string;
	name: string;
	balance: number;
	currency: string;
	currencyId?: string;
}

export const useAccountSlider = (items: Accounts[]) => {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [itemsPerView, setItemsPerView] = useState(1);

	useEffect(() => {
		const handleResize = () => {
			const width = window.innerWidth;
			if (width >= 1280) {
				setItemsPerView(4);
			} else if (width >= 1024) {
				setItemsPerView(3);
			} else if (width >= 768) {
				setItemsPerView(3);
			} else if (width >= 640) {
				setItemsPerView(2);
			} else {
				setItemsPerView(1);
			}
		};

		handleResize();
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	const totalItems = items.length;
	const maxIndex = Math.max(0, totalItems - itemsPerView);

	const canGoNext = currentIndex < maxIndex;
	const canGoPrev = currentIndex > 0;

	const next = useCallback(() => {
		if (canGoNext) {
			setCurrentIndex(prev => Math.min(prev + 1, maxIndex));
		}
	}, [canGoNext, maxIndex]);

	const prev = useCallback(() => {
		if (canGoPrev) {
			setCurrentIndex(prev => Math.max(prev - 1, 0));
		}
	}, [canGoPrev]);

	const goTo = useCallback(
		(index: number) => {
			setCurrentIndex(Math.max(0, Math.min(index, maxIndex)));
		},
		[maxIndex]
	);

	const visibleItems = items.slice(currentIndex, currentIndex + itemsPerView);

	return {
		currentIndex,
		visibleItems,
		totalItems,
		itemsPerView,
		canGoNext,
		canGoPrev,
		next,
		prev,
		goTo,
	};
};
