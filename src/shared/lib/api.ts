import axios from 'axios';

const api = axios.create({
	withCredentials: true,
});

let isRefreshing = false;
let failedQueue: {
	resolve: (value?: unknown) => void;
	reject: (reason?: any) => void;
}[] = [];

const processQueue = (error: any) => {
	failedQueue.forEach(promise => {
		if (error) {
			promise.reject(error);
		} else {
			promise.resolve();
		}
	});
	failedQueue = [];
};

api.interceptors.response.use(
	response => response,
	async error => {
		const originalRequest = error.config;

		if (error.response?.status !== 401) {
			return Promise.reject(error);
		}

		if (originalRequest._retry) {
			return Promise.reject(error);
		}

		if (isRefreshing) {
			return new Promise((resolve, reject) => {
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
		} catch (err) {
			processQueue(err);
			window.location.href = '/login';
			return Promise.reject(err);
		} finally {
			isRefreshing = false;
		}
	}
);

export { api };
