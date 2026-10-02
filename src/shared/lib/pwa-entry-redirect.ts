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
