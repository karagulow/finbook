const TOOLTIP_MOVE_MS = 520;

const motions = new WeakMap<HTMLElement, { shown: boolean }>();

const prefersReducedMotion = () =>
	window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const motionOf = (el: HTMLElement) => {
	const current = motions.get(el);
	if (current) return current;

	const created = { shown: false };
	motions.set(el, created);
	return created;
};

export const hideChartTooltip = (el: HTMLElement) => {
	const motion = motionOf(el);
	el.style.transition = prefersReducedMotion() ? 'none' : 'opacity 140ms ease';
	el.style.opacity = '0';
	motion.shown = false;
};

export const placeChartTooltip = (el: HTMLElement, x: number, y: number) => {
	const motion = motionOf(el);
	const transform = `translate(${Math.round(x)}px, ${Math.round(y)}px)`;

	el.style.left = '0px';
	el.style.top = '0px';

	if (!motion.shown || prefersReducedMotion()) {
		el.style.transition = 'none';
		el.style.transform = transform;
		el.getBoundingClientRect();
	} else {
		el.style.transition = `transform ${TOOLTIP_MOVE_MS}ms cubic-bezier(0.4, 0, 0.2, 1), opacity 200ms ease`;
		el.style.transform = transform;
	}

	el.style.opacity = '1';
	motion.shown = true;
};
