import React from 'react';
import { Fingerprint, Monitor, Smartphone } from 'lucide-react';

import { Container } from '@/src/shared/ui';
import { landingSection } from '../model/sections';

const EXPORT_SECTIONS = [
	'Счета',
	'Категории',
	'Операции',
	'Цели',
	'Долги',
] as const;

export const LandingData: React.FC = () => {
	return (
		<section
			id={landingSection.data.id}
			className='scroll-mt-20 py-16 sm:py-24'
		>
			<Container width={1280}>
				<div className='grid items-center gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16'>
					<div>
						<h2 className='max-w-[12em] font-semibold tracking-[-0.04em] text-[36px] leading-[1.08] sm:text-[52px] text-[var(--foreground-primary)]'>
							Ваши финансы. Ваши данные.
						</h2>
						<p className='mt-5 max-w-[38ch] font-medium text-[15px] sm:text-[16px] leading-relaxed text-[var(--foreground-secondary)]'>
							Защитите доступ к приложению, управляйте своими сессиями и в любой
							момент выгружайте данные в Excel.
						</p>
					</div>

					<div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
						<div
							style={{ '--landing-order': 0 } as React.CSSProperties}
							className='landing-reveal flex flex-col gap-6 rounded-[22px] border-[0.5px] border-[var(--border-primary)] bg-[var(--card)] p-5 sm:p-6'
						>
							<div className='flex items-center justify-between gap-3'>
								<p className='font-semibold text-[15px] text-[var(--foreground-primary)]'>
									Вход по PIN-коду
								</p>
								<Fingerprint
									size={22}
									strokeWidth={1.75}
									aria-hidden
									className='text-[var(--foreground-secondary)]'
								/>
							</div>
							<div className='flex items-center gap-2.5' aria-hidden>
								{[0, 1, 2, 3].map(index => (
									<span
										key={index}
										className={
											index < 2
												? 'size-3 rounded-full bg-[var(--foreground-primary)]'
												: 'size-3 rounded-full border-[1.5px] border-[var(--foreground-secondary)]'
										}
									/>
								))}
							</div>
							<p className='font-medium text-[13px] text-[var(--foreground-secondary)]'>
								Или вход по лицу и отпечатку на этом устройстве.
							</p>
						</div>

						<div
							style={{ '--landing-order': 1 } as React.CSSProperties}
							className='landing-reveal flex flex-col gap-4 rounded-[22px] border-[0.5px] border-[var(--border-primary)] bg-[var(--card)] p-5 sm:p-6'
						>
							<p className='font-semibold text-[15px] text-[var(--foreground-primary)]'>
								Устройства
							</p>
							<div className='flex items-start gap-3'>
								<Smartphone
									size={18}
									strokeWidth={1.75}
									aria-hidden
									className='mt-0.5 shrink-0 text-[var(--foreground-secondary)]'
								/>
								<p className='font-medium text-[13px] leading-relaxed text-[var(--foreground-secondary)]'>
									<span className='text-[var(--foreground-primary)]'>
										iPhone
									</span>
									<br />
									Москва · текущий сеанс
								</p>
							</div>
							<div className='flex items-start gap-3'>
								<Monitor
									size={18}
									strokeWidth={1.75}
									aria-hidden
									className='mt-0.5 shrink-0 text-[var(--foreground-secondary)]'
								/>
								<p className='font-medium text-[13px] leading-relaxed text-[var(--foreground-secondary)]'>
									<span className='text-[var(--foreground-primary)]'>
										MacBook
									</span>
									<br />
									Сессию можно завершить
								</p>
							</div>
						</div>

						<div
							style={{ '--landing-order': 2 } as React.CSSProperties}
							className='landing-reveal flex flex-col gap-4 rounded-[22px] border-[0.5px] border-[var(--border-primary)] bg-[var(--card)] p-5 sm:col-span-2 sm:p-6'
						>
							<div className='flex flex-col sm:flex-row items-baseline justify-between gap-1 sm:gap-3'>
								<p className='font-semibold text-[15px] text-[var(--foreground-primary)]'>
									Выгрузка в Excel
								</p>
								<p className='font-medium text-[13px] text-[var(--foreground-secondary)]'>
									За всё время или за выбранный период
								</p>
							</div>
							<div className='flex flex-wrap gap-1 sm:gap-2'>
								{EXPORT_SECTIONS.map(label => (
									<span
										key={label}
										className='rounded-full border-[0.5px] border-[var(--border-primary)] bg-[var(--background-primary)] px-3 py-1 font-medium text-[13px] text-[var(--foreground-primary)]'
									>
										{label}
									</span>
								))}
							</div>
						</div>
					</div>
				</div>
			</Container>
		</section>
	);
};
