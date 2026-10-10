'use client';

import { useEffect, useState } from 'react';

export function useHasSession() {
	const [authenticated, setAuthenticated] = useState(false);

	useEffect(() => {
		let cancelled = false;

		fetch('/api/auth/session', { credentials: 'include' })
			.then(response => (response.ok ? response.json() : null))
			.then(data => {
				if (!cancelled && data?.authenticated) setAuthenticated(true);
			})
			.catch(() => {});

		return () => {
			cancelled = true;
		};
	}, []);

	return authenticated;
}
