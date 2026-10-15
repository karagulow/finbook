import {
	canScrollDown,
	getScrollables,
	isSortHandle,
	isTextField,
} from './gesture-target';

export const MAX_UPWARD_OFFSET = 20;
export const UPWARD_RESISTANCE = 0.3;
const CLOSE_THRESHOLD = 120;
const FLICK_MIN_OFFSET = 48;
const FLICK_VELOCITY = 0.45;
const DRAG_SLOP = 8;

interface BindDrawerGestureOptions {
	dragOffset: { current: number };
	suppressClick: { current: boolean };
	publishOffset: (sheet: number) => void;
	setDragging: (dragging: boolean) => void;
	close: () => void;
}

export function bindDrawerGesture(
	drawer: HTMLElement,
	{
		dragOffset,
		suppressClick,
		publishOffset,
		setDragging,
		close,
	}: BindDrawerGestureOptions,
) {
	let startX = 0;
	let startY = 0;
	let lastY = 0;
	let lastTime = 0;
	let velocity = 0;
	let sheet = 0;
	let tracking = false;
	let hijacked = false;
	let horizontal = false;
	let axisLocked = false;
	let pulledFromRest = false;
	let scrollables: HTMLElement[] = [];
	let pointerId: number | null = null;
	let releaseFrame: number | null = null;

	const cancelRelease = () => {
		if (releaseFrame !== null) {
			cancelAnimationFrame(releaseFrame);
			releaseFrame = null;
		}
	};

	const renderSheet = () => {
		if (sheet < -MAX_UPWARD_OFFSET / UPWARD_RESISTANCE) {
			sheet = -MAX_UPWARD_OFFSET / UPWARD_RESISTANCE;
		}
		publishOffset(sheet);
	};

	const applyDelta = (delta: number) => {
		if (delta > 0) {
			let remaining = delta;

			if (sheet < 0) {
				const consume = Math.min(-sheet, remaining);
				sheet += consume;
				remaining -= consume;
			}

			for (const el of scrollables) {
				if (remaining <= 0) break;
				if (el.scrollTop <= 0) continue;
				const consume = Math.min(el.scrollTop, remaining);
				el.scrollTop -= consume;
				remaining -= consume;
			}

			sheet += remaining;
			return;
		}

		let remaining = -delta;

		if (sheet > 0) {
			const consume = Math.min(sheet, remaining);
			sheet -= consume;
			remaining -= consume;
		}

		for (const el of scrollables) {
			if (remaining <= 0) break;
			const room = el.scrollHeight - el.clientHeight - el.scrollTop;
			if (room <= 0) continue;
			const consume = Math.min(room, remaining);
			el.scrollTop += consume;
			remaining -= consume;
		}

		sheet -= remaining;
	};

	const finish = () => {
		if (!tracking && !hijacked) return;

		const visual = dragOffset.current;
		const shouldClose =
			hijacked &&
			(visual > CLOSE_THRESHOLD ||
				(visual > FLICK_MIN_OFFSET && velocity > FLICK_VELOCITY));

		tracking = false;
		hijacked = false;
		horizontal = false;
		axisLocked = false;
		pointerId = null;
		document.body.style.userSelect = '';

		setDragging(false);
		cancelRelease();

		const settle = () => {
			releaseFrame = requestAnimationFrame(() => {
				releaseFrame = null;
				if (shouldClose) close();
				else publishOffset(0);
			});
		};

		if (shouldClose || visual !== 0) {
			releaseFrame = requestAnimationFrame(settle);
			return;
		}

		publishOffset(0);
	};

	const onTouchStart = (event: TouchEvent) => {
		if (event.touches.length !== 1) return;

		suppressClick.current = false;
		const touch = event.touches[0];
		startX = touch.clientX;
		startY = touch.clientY;
		lastY = touch.clientY;
		lastTime = performance.now();
		velocity = 0;
		sheet = 0;
		hijacked = false;
		horizontal = false;
		axisLocked = false;
		tracking = !isTextField(event.target) && !isSortHandle(event.target);
		scrollables = tracking ? getScrollables(event.target, drawer) : [];
		pulledFromRest = tracking && !canScrollDown(scrollables);
		cancelRelease();
	};

	const onTouchMove = (event: TouchEvent) => {
		if (!tracking || event.touches.length !== 1) return;

		const touch = event.touches[0];
		const x = touch.clientX;
		const y = touch.clientY;
		const now = performance.now();
		const dt = now - lastTime;

		if (dt > 0 && dt < 50) velocity = (y - lastY) / dt;
		else if (dt >= 50) velocity = 0;

		const delta = y - lastY;
		lastY = y;
		lastTime = now;

		if (horizontal) return;

		const totalDx = x - startX;
		const totalDy = y - startY;

		if (!hijacked) {
			if (!axisLocked) {
				if (Math.abs(totalDx) < DRAG_SLOP && Math.abs(totalDy) < DRAG_SLOP) {
					return;
				}

				axisLocked = true;

				if (Math.abs(totalDx) > Math.abs(totalDy)) {
					horizontal = true;
					return;
				}
			}

			if (canScrollDown(scrollables)) pulledFromRest = false;
			if (delta <= 0 || canScrollDown(scrollables)) return;

			if (!event.cancelable) {
				horizontal = true;
				return;
			}

			hijacked = true;
			suppressClick.current = true;
			setDragging(true);
			document.body.style.userSelect = 'none';
			sheet = pulledFromRest && totalDy > 0 ? totalDy : delta;
			event.preventDefault();
			renderSheet();
			return;
		}

		if (event.cancelable) event.preventDefault();
		applyDelta(delta);
		renderSheet();
	};

	const onPointerDown = (event: PointerEvent) => {
		if (event.pointerType === 'touch' || event.button !== 0) return;
		if (isTextField(event.target) || isSortHandle(event.target)) return;

		suppressClick.current = false;
		startX = event.clientX;
		startY = event.clientY;
		lastY = event.clientY;
		lastTime = performance.now();
		velocity = 0;
		sheet = 0;
		hijacked = false;
		horizontal = false;
		tracking = true;
		scrollables = [];
		pointerId = event.pointerId;
		cancelRelease();
		drawer.setPointerCapture(event.pointerId);
	};

	const onPointerMove = (event: PointerEvent) => {
		if (event.pointerType === 'touch' || pointerId !== event.pointerId) return;
		if (!tracking) return;

		const now = performance.now();
		const dt = now - lastTime;
		if (dt > 0 && dt < 50) velocity = (event.clientY - lastY) / dt;
		else if (dt >= 50) velocity = 0;

		lastY = event.clientY;
		lastTime = now;

		const totalDx = event.clientX - startX;
		const totalDy = event.clientY - startY;

		if (!hijacked) {
			if (Math.abs(totalDx) < DRAG_SLOP && Math.abs(totalDy) < DRAG_SLOP) {
				return;
			}

			if (Math.abs(totalDx) > Math.abs(totalDy)) {
				horizontal = true;
				tracking = false;
				return;
			}

			hijacked = true;
			suppressClick.current = true;
			setDragging(true);
			document.body.style.userSelect = 'none';
		}

		sheet = totalDy;
		renderSheet();
	};

	const onPointerUp = (event: PointerEvent) => {
		if (event.pointerType === 'touch' || pointerId !== event.pointerId) return;
		if (drawer.hasPointerCapture(event.pointerId)) {
			drawer.releasePointerCapture(event.pointerId);
		}
		finish();
	};

	drawer.addEventListener('touchstart', onTouchStart, { passive: true });
	drawer.addEventListener('touchmove', onTouchMove, { passive: false });
	drawer.addEventListener('touchend', finish);
	drawer.addEventListener('touchcancel', finish);
	drawer.addEventListener('pointerdown', onPointerDown);
	drawer.addEventListener('pointermove', onPointerMove);
	drawer.addEventListener('pointerup', onPointerUp);
	drawer.addEventListener('pointercancel', onPointerUp);

	return () => {
		drawer.removeEventListener('touchstart', onTouchStart);
		drawer.removeEventListener('touchmove', onTouchMove);
		drawer.removeEventListener('touchend', finish);
		drawer.removeEventListener('touchcancel', finish);
		drawer.removeEventListener('pointerdown', onPointerDown);
		drawer.removeEventListener('pointermove', onPointerMove);
		drawer.removeEventListener('pointerup', onPointerUp);
		drawer.removeEventListener('pointercancel', onPointerUp);
		document.body.style.userSelect = '';
		cancelRelease();
	};
}
