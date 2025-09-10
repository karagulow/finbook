import { create } from 'zustand';
import Cookies from 'js-cookie';

interface AuthState {
	token: string | null;
	user: { email: string } | null;
	setAuth: (token: string, user: { email: string }) => void;
	logout: () => void;
}

export const useAuthStore = create<AuthState>(set => ({
	token: Cookies.get('authToken') || null,
	user: (() => {
		const email = Cookies.get('userEmail');
		return email ? { email } : null;
	})(),
	setAuth: (token, user) => {
		Cookies.set('authToken', token, {
			secure: true,
			sameSite: 'strict',
			expires: 1,
		});
		Cookies.set('userEmail', user.email, {
			secure: true,
			sameSite: 'strict',
			expires: 1,
		});
		set({ token, user });
	},
	logout: () => {
		set({ token: null, user: null });
	},
}));
