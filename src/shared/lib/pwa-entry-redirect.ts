const PWA_HIDDEN_AT_KEY = 'finbook-pwa-hidden-at';
const PWA_REOPEN_LOCK_MS = 1000;

export const pwaPinLockScript = `(function () {
	var standalone =
		window.matchMedia('(display-mode: standalone)').matches ||
		window.matchMedia('(display-mode: fullscreen)').matches ||
		window.matchMedia('(display-mode: minimal-ui)').matches ||
		window.matchMedia('(display-mode: window-controls-overlay)').matches ||
		window.navigator.standalone === true;

	if (!standalone) return;

	var key = '${PWA_HIDDEN_AT_KEY}';

	window.addEventListener('pagehide', function () {
		try {
			localStorage.setItem(key, String(Date.now()));
		} catch (error) {}
	});

	function maybeLock() {
		var raw;
		try {
			raw = localStorage.getItem(key);
			if (raw) localStorage.removeItem(key);
		} catch (error) {
			return;
		}

		if (!raw) return;

		var hiddenAt = Number(raw);

		if (
			!hiddenAt ||
			Date.now() - hiddenAt < ${PWA_REOPEN_LOCK_MS} ||
			location.pathname.indexOf('/lock') === 0 ||
			location.pathname.indexOf('/login') === 0 ||
			location.pathname.indexOf('/registration') === 0
		) {
			return;
		}

		document.documentElement.style.visibility = 'hidden';

		fetch('/api/auth/pin', { credentials: 'include' })
			.then(function (response) {
				if (!response.ok) return null;
				return response.json();
			})
			.then(function (data) {
				if (!data || !data.enabled) {
					document.documentElement.style.visibility = '';
					return;
				}

				return fetch('/api/auth/lock', {
					method: 'POST',
					credentials: 'include',
				}).finally(function () {
					var next = encodeURIComponent(location.pathname + location.search);
					location.replace('/lock?next=' + next);
				});
			})
			.catch(function () {
				document.documentElement.style.visibility = '';
			});
	}

	maybeLock();
	window.addEventListener('pageshow', maybeLock);
})();`;

export const pwaEntryRedirectScript = `(function () {
	var standalone =
		window.matchMedia('(display-mode: standalone)').matches ||
		window.matchMedia('(display-mode: fullscreen)').matches ||
		window.matchMedia('(display-mode: minimal-ui)').matches ||
		window.matchMedia('(display-mode: window-controls-overlay)').matches ||
		window.navigator.standalone === true;

	if (!standalone || location.pathname !== '/') return;

	location.replace('/home');
})();`;
