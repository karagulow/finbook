'use client';

import React, {
	useCallback,
	useEffect,
	useLayoutEffect,
	useMemo,
	useRef,
	useState,
} from 'react';
import { cn } from '@/src/shared/lib';

import emojiData from '@/constants/emoji-data.json';
import emojiKeywordsRu from '@/constants/emoji-keywords-ru.json';

interface EmojiItem {
	no: number;
	code: string;
	emoji: string;
	description: string;
	flagged: boolean;
	keywords: string[];
}

interface Props {
	className?: string;
	onSelect?: (emoji: string) => void;
	selectedEmoji?: string;
}

const COLUMNS = 10;
const GAP = 4;
const OVERSCAN_ROWS = 1;

const allEmojis = (Object.values(emojiData) as EmojiItem[][]).flat();
const russianKeywords = emojiKeywordsRu as Record<string, string[]>;

const foldSearch = (value: string) =>
	value.toLowerCase().replaceAll('ё', 'е');

const splitSearchWords = (value: string) =>
	foldSearch(value)
		.split(/[^\p{L}\p{N}]+/u)
		.filter(Boolean);

const searchIndex = allEmojis.map(item => ({
	item,
	text: foldSearch(`${item.description} ${item.keywords.join(' ')}`),
	ruWords: [
		...new Set(
			(russianKeywords[item.emoji] ?? []).flatMap(keyword =>
				splitSearchWords(keyword)
			)
		),
	],
}));

export const EmojiPicker: React.FC<Props> = ({
	className,
	onSelect,
	selectedEmoji,
}) => {
	const [isPickerOpen, setIsPickerOpen] = useState(false);
	const [animate, setAnimate] = useState(false);
	const [search, setSearch] = useState('');
	const [scrollTop, setScrollTop] = useState(0);
	const [viewport, setViewport] = useState({ width: 0, height: 0 });

	const pickerRef = useRef<HTMLDivElement>(null);
	const buttonRef = useRef<HTMLButtonElement>(null);
	const listRef = useRef<HTMLDivElement>(null);
	const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

	const filtered = useMemo(() => {
		const queryWords = splitSearchWords(search);
		if (queryWords.length === 0) return allEmojis;
		return searchIndex
			.filter(entry =>
				queryWords.every(
					word =>
						entry.text.includes(word) ||
						entry.ruWords.some(
							ruWord =>
								ruWord === word ||
								(word.length >= 4 && ruWord.startsWith(word))
						)
				)
			)
			.map(entry => entry.item);
	}, [search]);

	const cellSize =
		viewport.width > 0
			? (viewport.width - GAP * (COLUMNS - 1)) / COLUMNS
			: 0;
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
					Math.ceil((scrollTop + viewport.height) / rowStride) + OVERSCAN_ROWS
				)
			: 0;

	const close = useCallback(() => {
		setAnimate(false);
		if (closeTimer.current) clearTimeout(closeTimer.current);
		closeTimer.current = setTimeout(() => {
			setIsPickerOpen(false);
			closeTimer.current = null;
		}, 150);
	}, []);

	const open = () => {
		if (closeTimer.current) {
			clearTimeout(closeTimer.current);
			closeTimer.current = null;
		}
		if (isPickerOpen) {
			setAnimate(true);
			return;
		}
		setAnimate(false);
		setIsPickerOpen(true);
	};

	const togglePicker = () => (isPickerOpen ? close() : open());

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				pickerRef.current &&
				!pickerRef.current.contains(event.target as Node) &&
				buttonRef.current &&
				!buttonRef.current.contains(event.target as Node)
			) {
				close();
			}
		};

		if (isPickerOpen) {
			document.addEventListener('mousedown', handleClickOutside);
		}

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [isPickerOpen, close]);

	useLayoutEffect(() => {
		if (!isPickerOpen) return;
		const list = listRef.current;
		if (!list) return;

		const measure = () => {
			setViewport({ width: list.clientWidth, height: list.clientHeight });
		};

		measure();
		const observer = new ResizeObserver(measure);
		observer.observe(list);
		const frame = requestAnimationFrame(() => setAnimate(true));

		return () => {
			observer.disconnect();
			cancelAnimationFrame(frame);
		};
	}, [isPickerOpen]);

	useEffect(
		() => () => {
			if (closeTimer.current) clearTimeout(closeTimer.current);
		},
		[]
	);

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
		<div
			className={cn('relative flex flex-col items-center w-full', className)}
		>
			<button
				className='size-20 text-[34px] flex-shrink-0 bg-[var(--muted)] border-[0.5px] border-transparent rounded-full cursor-pointer active:scale-97 active:border-[var(--border-primary)] transition ease-in'
				type='button'
				onClick={togglePicker}
				ref={buttonRef}
			>
				{selectedEmoji}
			</button>

			{isPickerOpen && (
				<div
					ref={pickerRef}
					className='flex flex-col absolute top-full mt-2 z-10 w-full min-h-[300px] h-[300px] bg-[var(--muted)] rounded-[8px] shadow-2xl'
					style={{
						opacity: animate ? 1 : 0,
						translate: animate ? '0 0' : '0 -4px',
						transition: 'opacity 150ms ease-out, translate 150ms ease-out',
					}}
				>
					<input
						className='w-[calc(100%-8px)] m-1 px-2 py-1 rounded-[6px] bg-[var(--card)] outline-none text-[13px] text-[var(--foreground-primary)] placeholder:text-[var(--input-primary-placeholder)]'
						placeholder='Поиск эмодзи'
						value={search}
						onChange={e => setSearch(e.target.value)}
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
												onClick={() => {
													onSelect?.(item.emoji);
													close();
												}}
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
							Ничего не найдено
						</div>
					)}
				</div>
			)}
		</div>
	);
};
