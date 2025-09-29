'use client';

import React, { useRef, useEffect } from 'react';

import { TransactionGroup } from './transaction-group';
import { TransactionSkeleton } from './transaction-skeleton';

import { useTransactions } from '../hooks/use-transactions';

export const TransactionList: React.FC = () => {
	const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
		useTransactions(10);

	const loaderRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (!hasNextPage || !loaderRef.current) return;

		const observer = new IntersectionObserver(
			entries => {
				if (entries[0].isIntersecting) {
					fetchNextPage();
				}
			},
			{ threshold: 1 }
		);

		observer.observe(loaderRef.current);

		return () => observer.disconnect();
	}, [hasNextPage, fetchNextPage]);

	console.log(hasNextPage, isFetchingNextPage);

	return (
		<div className='flex flex-col gap-5'>
			{!data ? (
				<TransactionSkeleton count={10} />
			) : (
				data?.pages.map(page =>
					page.map(data => <TransactionGroup key={data.date} data={data} />)
				)
			)}

			{hasNextPage && (
				<div ref={loaderRef} className='text-center py-4 text-sm text-gray-500'>
					{isFetchingNextPage ? 'Загрузка...' : 'Прокрутите вниз для загрузки'}
				</div>
			)}
		</div>
	);
};
