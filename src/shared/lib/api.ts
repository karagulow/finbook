import axios from 'axios';

const api = axios.create({ withCredentials: true });

api.interceptors.response.use(
	res => res,
	async error => {
		if (error.response?.status === 401 && !error.config._retry) {
			error.config._retry = true;
			const refresh = await fetch('/api/auth/refresh', {
				method: 'POST',
				credentials: 'include',
			});
			if (refresh.ok) {
				return api(error.config);
			} else {
				window.location.href = '/login';
			}
		}
		throw error;
	}
);

export { api };
