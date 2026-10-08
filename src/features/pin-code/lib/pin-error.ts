import axios from 'axios';

export function getPinErrorMessage(error: unknown) {
	if (!axios.isAxiosError(error)) {
		return 'Не удалось выполнить действие. Попробуйте ещё раз.';
	}

	if (error.response?.data?.code === 'PIN_EXHAUSTED') {
		window.location.href = '/login?reason=pin-attempts';
		return '';
	}

	return (
		error.response?.data?.message ||
		'Не удалось выполнить действие. Попробуйте ещё раз.'
	);
}
