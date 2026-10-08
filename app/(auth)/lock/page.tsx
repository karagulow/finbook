import { Suspense } from 'react';
import type { Metadata } from 'next';

import { PinLockScreen } from '@/src/features/pin-code/ui/pin-lock-screen';

export const metadata: Metadata = {
	title: 'Пин-код',
};

export default function LockPage() {
	return (
		<Suspense
			fallback={
				<p className='text-[13px] text-[var(--foreground-secondary)]'>Загрузка...</p>
			}
		>
			<PinLockScreen />
		</Suspense>
	);
}
