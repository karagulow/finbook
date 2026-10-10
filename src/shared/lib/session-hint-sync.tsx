'use client';

import { useLayoutEffect } from 'react';
import { usePathname } from 'next/navigation';
import { HAS_SESSION_COOKIE } from '@/src/shared/lib/pin-constants';

export function SessionHintSync() {
	const pathname = usePathname();

	useLayoutEffect(() => {
		const hasSession = document.cookie
			.split('; ')
			.includes(`${HAS_SESSION_COOKIE}=1`);

		document.documentElement.classList.toggle('has-session', hasSession);
	}, [pathname]);

	return null;
}
