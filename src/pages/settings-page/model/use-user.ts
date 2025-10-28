'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

import type { User } from './types';

export function useUser() {
	const [user, setUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let isMounted = true;

		const fetchUser = async () => {
			try {
				const { data } = await axios.get<User>('/api/user');
				if (isMounted) setUser(data);
			} catch (err: unknown) {
				if (isMounted) {
					let message = 'Неизвестная ошибка';

					if (axios.isAxiosError(err)) {
						message =
							err.response?.data?.error ||
							err.message ||
							'Ошибка при загрузке пользователя';
					} else if (err instanceof Error) {
						message = err.message;
					}

					setError(message);
				}
			} finally {
				if (isMounted) setIsLoading(false);
			}
		};

		fetchUser();
		return () => {
			isMounted = false;
		};
	}, []);

	return { user, isLoading, error };
}
