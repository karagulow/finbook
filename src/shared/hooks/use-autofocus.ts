import { useEffect, type RefObject } from 'react';

const FIELD_SELECTOR = [
	'input:not([type="hidden"]):not([type="checkbox"]):not([type="radio"]):not([type="button"]):not([type="submit"]):not([type="reset"]):not([type="file"]):not([type="color"]):not([type="range"]):not([disabled]):not([readonly])',
	'textarea:not([disabled]):not([readonly])',
].join(',');

export function focusFirstField(root: ParentNode | null) {
	if (!root) return;

	const active = document.activeElement;

	if (
		active instanceof HTMLElement &&
		root.contains(active) &&
		active.matches(FIELD_SELECTOR)
	) {
		return;
	}

	const fields = root.querySelectorAll<HTMLElement>(FIELD_SELECTOR);

	for (const field of fields) {
		if (field.tabIndex < 0 || field.getClientRects().length === 0) continue;

		field.focus({ preventScroll: true });
		return;
	}
}

export function useAutofocus(
	isOpen: boolean,
	containerRef: RefObject<HTMLElement | null>,
) {
	useEffect(() => {
		if (!isOpen) return;

		focusFirstField(containerRef.current);
	}, [containerRef, isOpen]);
}
