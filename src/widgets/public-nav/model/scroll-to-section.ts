const STORAGE_KEY = 'finbook:landing-scroll';

function prefersReducedMotion() {
	return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function scrollToLandingSection(id: string) {
	const target = document.getElementById(id);
	if (!target) return;

	if (document.body.style.overflow === 'hidden') {
		document.body.style.overflow = '';
	}

	target.scrollIntoView({
		behavior: prefersReducedMotion() ? 'auto' : 'smooth',
		block: 'start',
	});

	const hash = `#${id}`;
	if (window.location.pathname === '/' && window.location.hash !== hash) {
		window.history.pushState(null, '', hash);
	}
}

export function queueLandingScroll(id: string) {
	sessionStorage.setItem(STORAGE_KEY, id);
}

export function flushQueuedLandingScroll() {
	const id = sessionStorage.getItem(STORAGE_KEY);
	if (!id) return;

	sessionStorage.removeItem(STORAGE_KEY);

	if (!prefersReducedMotion()) {
		window.scrollTo(0, 0);
	}

	requestAnimationFrame(() => {
		scrollToLandingSection(id);
	});
}
