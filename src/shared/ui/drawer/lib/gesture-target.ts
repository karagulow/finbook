export function isSortHandle(target: EventTarget | null) {
	return (
		target instanceof Element &&
		Boolean(target.closest('[aria-roledescription="sortable"]'))
	);
}

export function isTextField(target: EventTarget | null) {
	if (!(target instanceof Element)) return false;

	const field = target.closest(
		'input, textarea, select, [contenteditable="true"]',
	);
	if (!field) return false;

	if (field instanceof HTMLInputElement) {
		const type = field.type;
		if (
			type === 'button' ||
			type === 'checkbox' ||
			type === 'radio' ||
			type === 'range' ||
			type === 'submit' ||
			type === 'reset' ||
			type === 'file' ||
			type === 'color'
		) {
			return false;
		}
	}

	return true;
}

function isScrollable(el: HTMLElement) {
	const { overflowY } = window.getComputedStyle(el);
	return (
		(overflowY === 'auto' ||
			overflowY === 'scroll' ||
			overflowY === 'overlay') &&
		el.scrollHeight > el.clientHeight + 1
	);
}

export function getScrollables(target: EventTarget | null, boundary: HTMLElement) {
	const scrollables: HTMLElement[] = [];
	let node =
		target instanceof HTMLElement
			? target
			: target instanceof Node
				? target.parentElement
				: null;

	while (node && node !== boundary) {
		if (isScrollable(node)) scrollables.push(node);
		node = node.parentElement;
	}

	return scrollables;
}

export function canScrollDown(scrollables: HTMLElement[]) {
	return scrollables.some(el => el.scrollTop > 1);
}
