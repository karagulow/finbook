'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

import { api, cn, toastOptions } from '@/src/shared/lib';
import { Button, Checkbox, DatePicker, Select } from '@/src/shared/ui';

type SectionKey = 'accounts' | 'categories' | 'transactions' | 'goals' | 'debts';

type Period = 'all' | 'year' | 'custom';

type AccountOption = {
	id: string;
	name: string;
};

const SECTIONS: { key: SectionKey; label: string }[] = [
	{ key: 'accounts', label: 'Счета' },
	{ key: 'categories', label: 'Категории и подкатегории' },
	{ key: 'transactions', label: 'Операции' },
	{ key: 'goals', label: 'Цели' },
	{ key: 'debts', label: 'Долги' },
];

const PERIOD_OPTIONS = [
	{ value: 'all', label: 'За всё время' },
	{ value: 'year', label: 'Этот год' },
	{ value: 'custom', label: 'Свои даты' },
] as const;

const startOfDay = (date: Date) =>
	new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);

const endOfDay = (date: Date) =>
	new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999);

const fileNameFromHeader = (header: string | undefined) => {
	const match = header?.match(/filename="([^"]+)"/);
	if (match?.[1]) return match[1];
	return `finbook-${format(new Date(), 'yyyy-MM-dd')}.xlsx`;
};

const downloadBlob = (blob: Blob, fileName: string) => {
	const url = URL.createObjectURL(blob);
	const link = document.createElement('a');
	link.href = url;
	link.download = fileName;
	document.body.appendChild(link);
	link.click();
	link.remove();
	URL.revokeObjectURL(url);
};

interface Props {
	onClose: () => void;
}

export const ExportDataContent: React.FC<Props> = ({ onClose }) => {
	const [sections, setSections] = useState<Record<SectionKey, boolean>>({
		accounts: true,
		categories: true,
		transactions: true,
		goals: true,
		debts: true,
	});
	const [accounts, setAccounts] = useState<AccountOption[]>([]);
	const [selectedIds, setSelectedIds] = useState<string[]>([]);
	const [accountsReady, setAccountsReady] = useState(false);
	const [period, setPeriod] = useState<Period>('all');
	const [from, setFrom] = useState<Date | null>(null);
	const [to, setTo] = useState<Date | null>(null);
	const [loading, setLoading] = useState(false);

	const accountFilterActive = sections.transactions || sections.debts;
	const hasSection = SECTIONS.some(section => sections[section.key]);
	const allAccountsSelected =
		accounts.length > 0 && selectedIds.length === accounts.length;
	const customRangeActive = sections.transactions && period === 'custom';
	const customRangeInvalid = Boolean(
		customRangeActive && from && to && startOfDay(from) > startOfDay(to),
	);
	const customRangeMissing = customRangeActive && (!from || !to);
	const canDownload =
		hasSection &&
		accountsReady &&
		!customRangeInvalid &&
		!customRangeMissing &&
		!loading;

	useEffect(() => {
		let cancelled = false;

		const loadAccounts = async () => {
			try {
				const { data } = await api.get<AccountOption[]>('/api/accounts');
				if (cancelled) return;
				setAccounts(data);
				setSelectedIds(data.map(account => account.id));
			} catch (error) {
				console.error(error);
				if (!cancelled) {
					toast.error('Не удалось загрузить счета', toastOptions);
				}
			} finally {
				if (!cancelled) setAccountsReady(true);
			}
		};

		loadAccounts();

		return () => {
			cancelled = true;
		};
	}, []);

	const toggleSection = (key: SectionKey) => {
		setSections(current => ({ ...current, [key]: !current[key] }));
	};

	const toggleAllAccounts = () => {
		setSelectedIds(allAccountsSelected ? [] : accounts.map(account => account.id));
	};

	const toggleAccount = (id: string) => {
		setSelectedIds(current =>
			current.includes(id) ? current.filter(item => item !== id) : [...current, id],
		);
	};

	const periodBounds = () => {
		if (!sections.transactions || period === 'all') {
			return { from: null, to: null };
		}

		if (period === 'year') {
			const year = new Date().getFullYear();
			return {
				from: new Date(year, 0, 1, 0, 0, 0, 0).toISOString(),
				to: new Date(year, 11, 31, 23, 59, 59, 999).toISOString(),
			};
		}

		return {
			from: from ? startOfDay(from).toISOString() : null,
			to: to ? endOfDay(to).toISOString() : null,
		};
	};

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();
		if (!canDownload) return;

		const bounds = periodBounds();
		const accountIds =
			!accountFilterActive || accounts.length === 0 || allAccountsSelected
				? null
				: selectedIds;

		try {
			setLoading(true);
			const response = await api.post(
				'/api/export',
				{
					sections,
					accountIds,
					from: bounds.from,
					to: bounds.to,
					timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
				},
				{ responseType: 'blob' },
			);

			const blob = new Blob([response.data], {
				type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
			});
			downloadBlob(
				blob,
				fileNameFromHeader(response.headers['content-disposition']),
			);
			toast.success('Файл скачан', toastOptions);
			onClose();
		} catch (error: unknown) {
			let message = 'Не удалось выгрузить данные';

			if (axios.isAxiosError(error) && error.response?.data instanceof Blob) {
				try {
					const text = await error.response.data.text();
					const parsed = JSON.parse(text) as { message?: string };
					message = parsed.message || message;
				} catch {
					message = error.message || message;
				}
			} else if (error instanceof Error) {
				message = error.message;
			}

			toast.error(message, toastOptions);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className='flex h-full min-h-0 flex-col gap-5'>
			<h2 className='shrink-0 font-bold text-[17px] text-[var(--foreground-primary)]'>
				Выгрузка
			</h2>

			<form
				onSubmit={handleSubmit}
				className='flex min-h-0 flex-1 flex-col gap-5'
			>
				<div className='flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto'>
					<div className='flex flex-col gap-3'>
						<span className='font-medium text-[13px] text-[var(--foreground-secondary)]'>
							Состав
						</span>
						{SECTIONS.map(section => (
							<Checkbox
								key={section.key}
								checked={sections[section.key]}
								onChange={() => toggleSection(section.key)}
								label={section.label}
							/>
						))}
						{!hasSection && (
							<span className='text-[13px] text-[var(--wrong)]'>
								Выберите хотя бы один раздел
							</span>
						)}
					</div>

					<div
						className={cn(
							'flex flex-col gap-3',
							!sections.transactions && 'opacity-50 pointer-events-none',
						)}
					>
						<Select
							label='Период операций'
							value={period}
							onChange={value => setPeriod(value as Period)}
							options={PERIOD_OPTIONS.map(option => ({
								value: option.value,
								label: option.label,
							}))}
							disabled={!sections.transactions}
						/>
						{period === 'custom' && sections.transactions && (
							<div className='flex flex-col gap-1.5'>
								<div className='grid grid-cols-2 gap-3'>
									<DatePicker
										label='С'
										value={from}
										onChange={setFrom}
										placeholder='Начало'
									/>
									<DatePicker
										label='По'
										value={to}
										onChange={setTo}
										placeholder='Конец'
										popupAlign='end'
									/>
								</div>
								{customRangeInvalid && (
									<span className='font-semibold text-[11px] text-[var(--wrong)]'>
										Дата начала позже даты окончания
									</span>
								)}
							</div>
						)}
					</div>

					<div
						className={cn(
							'flex flex-col gap-3',
							!accountFilterActive && 'opacity-50 pointer-events-none',
						)}
					>
						<span className='font-medium text-[13px] text-[var(--foreground-secondary)]'>
							Счета
						</span>
						<span className='text-[13px] text-[var(--foreground-secondary)]'>
							Фильтр действует на операции и долги. Цели выгружаются целиком.
						</span>
						{accounts.length > 0 ? (
							<>
								<Checkbox
									checked={allAccountsSelected}
									onChange={toggleAllAccounts}
									label='Все счета'
								/>
								<div className='flex flex-col gap-2.5 pl-6'>
									{accounts.map(account => (
										<Checkbox
											key={account.id}
											checked={selectedIds.includes(account.id)}
											onChange={() => toggleAccount(account.id)}
											label={account.name}
										/>
									))}
								</div>
							</>
						) : (
							<span className='text-[13px] text-[var(--foreground-secondary)]'>
								{accountsReady ? 'Счетов пока нет.' : 'Загрузка счетов…'}
							</span>
						)}
					</div>
				</div>

				<Button type='submit' disabled={!canDownload} className='shrink-0'>
					{loading ? 'Подготовка…' : 'Скачать'}
				</Button>
			</form>
		</div>
	);
};
