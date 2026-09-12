import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import Cookies from 'js-cookie';

const api = axios.create({
	withCredentials: true,
});

let isRefreshing = false;

const AUTH_ENDPOINTS_WITHOUT_REFRESH = [
	'/api/auth/login',
	'/api/auth/registration',
	'/api/auth/refresh',
	'/api/auth/logout',
];

type FailedQueueItem = {
	resolve: (value?: AxiosResponse) => void;
	reject: (reason?: unknown) => void;
};

let failedQueue: FailedQueueItem[] = [];

const processQueue = (error: unknown | null) => {
	failedQueue.forEach(promise => {
		if (error) {
			promise.reject(error);
		} else {
			promise.resolve();
		}
	});
	failedQueue = [];
};

const shouldSkipTokenRefresh = (url?: string) =>
	Boolean(
		url &&
		AUTH_ENDPOINTS_WITHOUT_REFRESH.some(endpoint => url.includes(endpoint)),
	);

api.interceptors.response.use(
	(response: AxiosResponse) => response,
	async (
		error: AxiosError & { config: AxiosRequestConfig & { _retry?: boolean } },
	) => {
		const originalRequest = error.config;

		if (error.response?.status !== 401) {
			return Promise.reject(error);
		}

		if (shouldSkipTokenRefresh(originalRequest.url)) {
			return Promise.reject(error);
		}

		if (originalRequest._retry) {
			return Promise.reject(error);
		}

		if (isRefreshing) {
			return new Promise<AxiosResponse>((resolve, reject) => {
				failedQueue.push({
					resolve: () => resolve(api(originalRequest)),
					reject,
				});
			});
		}

		originalRequest._retry = true;
		isRefreshing = true;

		try {
			await api.post('/api/auth/refresh');

			processQueue(null);
			return api(originalRequest);
		} catch (err: unknown) {
			processQueue(err);

			if (typeof window !== 'undefined') {
				Cookies.remove('authToken', { path: '/' });
				Cookies.remove('refreshToken', { path: '/' });
				Cookies.remove('userEmail', { path: '/' });

				document.cookie =
					'authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict';
				document.cookie =
					'refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict';
				document.cookie =
					'userEmail=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict';
			}

			window.location.href = '/login';
			return Promise.reject(err);
		} finally {
			isRefreshing = false;
		}
	},
);

export { api };
