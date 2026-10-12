import React from 'react';
import { Palmtree, Shield, type LucideIcon } from 'lucide-react';

import { Container } from '@/src/shared/ui';
import { landingSection } from '../model/sections';

const GOALS = [
	{
		icon: Palmtree,
		name: 'Отпуск',
		deadline: 'до 1 июня 2027',
		pace: 'Откладывать 18 000 ₽ в месяц',
		progress: 72,
		saved: '180 000 ₽',
		target: '250 000 ₽',
	},
	{
		icon: Shield,
		name: 'Подушка',
		deadline: 'до 1 марта 2027',
		pace: 'Отстаёте примерно на 24 000 ₽',
		progress: 41,
		saved: '82 000 ₽',
		target: '200 000 ₽',
	},
] as const;

const DEBTS = [
	{
		name: 'Ипотека',
		deadline: 'до 15 декабря 2034',
		progress: 64,
		saved: '1 920 000',
		target: '3 000 000 ₽',
	},
	{
		name: 'Маме',
		deadline: 'до 1 сентября 2026',
		progress: 28,
		saved: '14 000',
		target: '50 000 ₽',
	},
] as const;

export const LandingPlans: React.FC = () => {
	return (
		<section
			id={landingSection.plans.id}
			className='scroll-mt-20 py-16 sm:py-24'
		>
			<Container width={1280}>
				<h2 className='max-w-[14em] font-semibold tracking-[-0.04em] text-[36px] leading-[1.08] sm:text-[52px] text-[var(--foreground-primary)]'>
					Планы и долги — под контролем.
				</h2>

				<p className='mt-5 max-w-[42ch] font-medium text-[15px] sm:text-[16px] leading-relaxed text-[var(--foreground-secondary)]'>
					Следите за накоплениями, планируйте взносы и погашайте долги в своём
					темпе.
				</p>

				<div className='mt-10 grid grid-cols-1 gap-4 sm:mt-14 lg:grid-cols-2'>
					<article
						style={{ '--landing-order': 0 } as React.CSSProperties}
						className='landing-reveal flex flex-col overflow-hidden rounded-[2rem] border-[0.5px] border-[var(--border-primary)] bg-[var(--card)] p-2'
					>
						<div className='p-6 sm:p-10'>
							<h3 className='text-2xl font-semibold tracking-[-0.2px] text-[var(--foreground-primary)]'>
								Цели
							</h3>
							<p className='mt-4 max-w-lg text-base/7 font-normal text-[var(--foreground-secondary)]'>
								Отпуск, крупная покупка или финансовая подушка. Видно, сколько
								уже накоплено и сколько осталось.
							</p>
						</div>

						<div className='flex flex-col gap-2 rounded-[1.5rem] bg-[var(--background-primary)] p-3 sm:p-4'>
							{GOALS.map(goal => (
								<GoalRow key={goal.name} goal={goal} />
							))}
						</div>
					</article>

					<article
						style={{ '--landing-order': 1 } as React.CSSProperties}
						className='landing-reveal flex flex-col overflow-hidden rounded-[2rem] border-[0.5px] border-[var(--border-primary)] bg-[var(--card)] p-2'
					>
						<div className='p-6 sm:p-10'>
							<h3 className='text-2xl font-semibold tracking-[-0.2px] text-[var(--foreground-primary)]'>
								Долги
							</h3>
							<p className='mt-4 max-w-lg text-base/7 font-normal text-[var(--foreground-secondary)]'>
								Все долги в одном месте. Знайте, сколько ещё нужно вернуть или
								получить.
							</p>
						</div>

						<div className='flex flex-col gap-2 rounded-[1.5rem] bg-[var(--background-primary)] p-3 sm:p-4'>
							{DEBTS.map(debt => (
								<DebtRow key={debt.name} debt={debt} />
							))}
						</div>
					</article>
				</div>
			</Container>
		</section>
	);
};

const GoalRow: React.FC<{ goal: (typeof GOALS)[number] }> = ({ goal }) => {
	return (
		<div className='flex items-center gap-4 rounded-[16px] border-[0.5px] border-[var(--border-primary)] bg-[var(--card)] p-4'>
			<ProgressRing progress={goal.progress} icon={goal.icon} />
			<div className='flex min-w-0 flex-1 flex-col gap-0.5'>
				<div className='flex items-baseline justify-between gap-3'>
					<span className='truncate font-medium text-[15px] text-[var(--foreground-primary)]'>
						{goal.name}
					</span>
					<span className='shrink-0 font-medium text-[15px] tabular-nums text-[var(--foreground-primary)]'>
						{goal.progress}%
					</span>
				</div>
				<span className='font-medium text-[13px] text-[var(--foreground-secondary)]'>
					{goal.deadline}
				</span>
				<span className='font-medium text-[13px] text-[var(--foreground-primary)]'>
					{goal.pace}
				</span>
				<span className='mt-1 font-medium text-[15px] tabular-nums text-[var(--foreground-primary)]'>
					{goal.saved}
					<span className='text-[var(--foreground-secondary)]'>
						{' '}
						/ {goal.target}
					</span>
				</span>
			</div>
		</div>
	);
};

const DebtRow: React.FC<{ debt: (typeof DEBTS)[number] }> = ({ debt }) => {
	return (
		<div className='flex flex-col gap-2 rounded-[16px] border-[0.5px] border-[var(--border-primary)] bg-[var(--card)] p-4'>
			<div className='flex min-w-0 flex-col gap-0.5'>
				<span className='truncate font-medium text-[15px] text-[var(--foreground-primary)]'>
					{debt.name}
				</span>
				<span className='font-medium text-[13px] text-[var(--foreground-secondary)]'>
					{debt.deadline}
				</span>
			</div>
			<div className='flex flex-col items-end gap-1'>
				<span className='font-medium text-[15px] tabular-nums text-[var(--foreground-primary)]'>
					{debt.saved}
					<span className='text-[var(--foreground-secondary)]'>
						{' '}
						/ {debt.target}
					</span>
				</span>
				<div className='h-1 w-full overflow-hidden rounded-full bg-[var(--border-primary-hover)]'>
					<div
						className='h-full rounded-full bg-[var(--foreground-primary)]'
						style={{ width: `${debt.progress}%` }}
					/>
				</div>
			</div>
		</div>
	);
};

const ProgressRing: React.FC<{ progress: number; icon: LucideIcon }> = ({
	progress,
	icon: Icon,
}) => {
	const size = 64;
	const stroke = 6;
	const radius = (size - stroke) / 2;
	const circumference = 2 * Math.PI * radius;
	const offset = circumference - (progress / 100) * circumference;

	return (
		<div className='relative shrink-0' style={{ width: size, height: size }}>
			<svg
				className='size-full -rotate-90'
				viewBox={`0 0 ${size} ${size}`}
				aria-hidden
			>
				<circle
					cx={size / 2}
					cy={size / 2}
					r={radius}
					fill='none'
					stroke='var(--border-primary-hover)'
					strokeWidth={stroke}
				/>
				<circle
					cx={size / 2}
					cy={size / 2}
					r={radius}
					fill='none'
					stroke='var(--foreground-primary)'
					strokeWidth={stroke}
					strokeLinecap='round'
					strokeDasharray={circumference}
					strokeDashoffset={offset}
				/>
			</svg>
			<span className='absolute inset-0 flex items-center justify-center text-[var(--foreground-primary)]'>
				<Icon size={22} strokeWidth={1.75} aria-hidden />
			</span>
		</div>
	);
};
