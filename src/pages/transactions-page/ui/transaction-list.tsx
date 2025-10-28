'use client';

import React, { useRef, useEffect } from 'react';

import { TransactionGroup } from './transaction-group';
import { TransactionSkeleton } from './transaction-skeleton';

import { useTransactions } from '../hooks/use-transactions';

export const TransactionList: React.FC = () => {
	const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
		useTransactions(25);

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

	const allGroups = data?.pages.flatMap(page => page.groups) ?? [];

	const isEmpty = !isLoading && allGroups.length === 0;

	return (
		<div className='flex flex-col gap-5'>
			{isLoading ? (
				<TransactionSkeleton count={10} />
			) : isEmpty ? (
				<div className='text-center text-[var(--foreground-secondary)] text-[13px]'>
					Транзакции не найдены.
				</div>
			) : (
				allGroups.map((group, index) => (
					<TransactionGroup key={index} data={group} />
				))
			)}

			{hasNextPage && (
				<div ref={loaderRef} className='text-center py-4 text-sm text-gray-500'>
					{isFetchingNextPage ? 'Загрузка...' : ''}
				</div>
			)}
		</div>
	);
};
