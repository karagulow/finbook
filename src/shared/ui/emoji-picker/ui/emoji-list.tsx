'use client';

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { searchEmojis } from '../lib/emoji-search';

interface EmojiListProps {
	search: string;
	onSearchChange: (value: string) => void;
	onSelect: (emoji: string) => void;
}

const COLUMNS = 10;
const GAP = 4;
const OVERSCAN_ROWS = 1;

export const EmojiList = ({
	search,
	onSearchChange,
	onSelect,
}: EmojiListProps) => {
	const [scrollTop, setScrollTop] = useState(0);
	const [viewport, setViewport] = useState({ width: 0, height: 0 });

	const listRef = useRef<HTMLDivElement>(null);

	const filtered = useMemo(() => searchEmojis(search), [search]);

	const cellSize =
		viewport.width > 0 ? (viewport.width - GAP * (COLUMNS - 1)) / COLUMNS : 0;

	const rowStride = cellSize + GAP;
	const rowCount = Math.ceil(filtered.length / COLUMNS);

	const totalHeight =
		rowCount === 0 ? 0 : rowCount * cellSize + (rowCount - 1) * GAP;

	const startRow =
		cellSize > 0
			? Math.max(0, Math.floor(scrollTop / rowStride) - OVERSCAN_ROWS)
			: 0;

	const endRow =
		cellSize > 0
			? Math.min(
					rowCount,
					Math.ceil((scrollTop + viewport.height) / rowStride) + OVERSCAN_ROWS,
				)
			: 0;

	useLayoutEffect(() => {
		const list = listRef.current;
		if (!list) return;

		const measure = () => {
			setViewport({
				width: list.clientWidth,
				height: list.clientHeight,
			});
		};

		measure();

		const observer = new ResizeObserver(measure);
		observer.observe(list);

		return () => observer.disconnect();
	}, []);

	useEffect(() => {
		listRef.current?.scrollTo({ top: 0 });
		setScrollTop(0);
	}, [search]);

	const rows = [];

	for (let row = startRow; row < endRow; row += 1) {
		const start = row * COLUMNS;

		rows.push({
			row,
			items: filtered.slice(start, start + COLUMNS),
		});
	}

	return (
		<>
			<input
				className='w-[calc(100%-8px)] m-1 px-2 py-1 rounded-[6px] bg-[var(--card)] outline-none text-[13px] text-[var(--foreground-primary)] placeholder:text-[var(--input-primary-placeholder)]'
				placeholder='Поиск эмодзи'
				value={search}
				onChange={event => onSearchChange(event.target.value)}
			/>

			{filtered.length > 0 ? (
				<div
					ref={listRef}
					className='m-1 min-h-0 flex-1 overflow-x-hidden overflow-y-auto [scrollbar-gutter:stable]'
					onScroll={event => setScrollTop(event.currentTarget.scrollTop)}
				>
					<div className='relative w-full' style={{ height: totalHeight }}>
						{rows.map(({ row, items }) => (
							<div
								key={row}
								className='absolute left-0 grid w-full grid-cols-10'
								style={{
									top: row * rowStride,
									height: cellSize,
									gap: GAP,
								}}
							>
								{items.map(item => (
									<button
										key={item.code}
										className='text-2xl text-center cursor-pointer active:scale-97'
										style={{ height: cellSize }}
										onClick={() => onSelect(item.emoji)}
										type='button'
									>
										{item.emoji}
									</button>
								))}
							</div>
						))}
					</div>
				</div>
			) : (
				<div className='p-2 text-[13px] text-[var(--foreground-secondary)]'>
					Ничего не найдено
				</div>
			)}
		</>
	);
};
