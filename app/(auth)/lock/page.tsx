import { Suspense } from 'react';
import type { Metadata } from 'next';

import { PinLockScreen } from '@/src/features/pin-code/ui/pin-lock-screen';
import { Loader } from '@/src/shared/ui';

export const metadata: Metadata = {
	title: 'Пин-код',
	robots: {
		index: false,
		follow: false,
	},
};

export default function LockPage() {
	return (
		<Suspense
			fallback={
				<Loader className='text-[var(--foreground-secondary)]' />
			}
		>
			<PinLockScreen />
		</Suspense>
	);
}
