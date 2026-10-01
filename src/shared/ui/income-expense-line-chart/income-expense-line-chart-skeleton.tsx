'use client';

import React from 'react';

const incomeLine =
	'M0,0.58 C0.1,0.64 0.18,0.36 0.3,0.42 C0.42,0.48 0.5,0.2 0.62,0.28 C0.74,0.36 0.86,0.14 1,0.22';

const expenseLine =
	'M0,0.74 C0.14,0.7 0.22,0.8 0.34,0.72 C0.46,0.64 0.56,0.68 0.68,0.52 C0.8,0.36 0.9,0.44 1,0.38';

const yLabels = ['w-9', 'w-7', 'w-10', 'w-6', 'w-8'];
const xLabels = ['w-8', 'w-6', 'w-9', 'w-7', 'w-8', 'w-6'];

function ShimmerShape({ id, d }: { id: string; d: string }) {
	return (
		<>
			<svg width='0' height='0' className='absolute' aria-hidden>
				<defs>
					<mask
						id={id}
						maskUnits='objectBoundingBox'
						maskContentUnits='objectBoundingBox'
					>
						<path
							d={d}
							fill='none'
							stroke='white'
							strokeWidth='0.018'
							strokeLinecap='round'
							strokeLinejoin='round'
						/>
					</mask>
				</defs>
			</svg>
			<div
				className='skeleton-shimmer absolute inset-0'
				style={{
					mask: `url(#${id})`,
					WebkitMask: `url(#${id})`,
				}}
			/>
		</>
	);
}

export const IncomeExpenseLineChartSkeleton = () => {
	return (
		<div className='flex w-full flex-col items-center gap-5 rounded-[16px] border-[0.5px] border-[var(--border-primary)] bg-[var(--card)] p-4 pt-3 sm:p-7.5 sm:pt-5'>
			<div className='skeleton-shimmer mr-auto h-[17px] w-44 rounded-[8px]' />

			<div className='flex h-[300px] w-full flex-col'>
				<div className='flex min-h-0 flex-1 gap-3'>
					<div className='flex w-10 shrink-0 flex-col justify-between py-1'>
						{yLabels.map((width, index) => (
							<div
								key={index}
								className={`skeleton-shimmer h-[10px] rounded-[8px] ${width}`}
							/>
						))}
					</div>

					<div className='flex min-w-0 flex-1 flex-col'>
						<div className='relative min-h-0 flex-1'>
							<div className='absolute inset-0 flex flex-col justify-between py-1'>
								{yLabels.map((_, index) => (
									<div
										key={index}
										className='border-b-[0.5px] border-[var(--border-primary)]'
									/>
								))}
							</div>

							<ShimmerShape id='income-skeleton-line' d={incomeLine} />
							<ShimmerShape id='expense-skeleton-line' d={expenseLine} />
						</div>

						<div className='mt-3 flex items-center justify-between'>
							{xLabels.map((width, index) => (
								<div
									key={index}
									className={`skeleton-shimmer h-[10px] rounded-[8px] ${width}`}
								/>
							))}
						</div>
					</div>
				</div>

				<div className='mt-4 flex items-center justify-center gap-6'>
					<div className='flex items-center gap-2'>
						<div className='skeleton-shimmer size-3 rounded-[3px]' />
						<div className='skeleton-shimmer h-[13px] w-14 rounded-[8px]' />
					</div>
					<div className='flex items-center gap-2'>
						<div className='skeleton-shimmer size-3 rounded-[3px]' />
						<div className='skeleton-shimmer h-[13px] w-16 rounded-[8px]' />
					</div>
				</div>
			</div>
		</div>
	);
};
