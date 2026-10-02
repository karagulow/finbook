'use client';

import React, { useEffect, useRef } from 'react';

interface Star {
	x: number;
	y: number;
	z: number;
}

const STAR_COUNT = 220;
const SPEED = 0.012;

const spawnStar = (randomZ = true): Star => {
	const z = randomZ ? Math.random() * 0.96 + 0.04 : 1;
	return {
		x: Math.random() * 2 - 1,
		y: Math.random() * 2 - 1,
		z,
	};
};

export const LandingCtaStarfield: React.FC = () => {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		const reduced = window.matchMedia(
			'(prefers-reduced-motion: reduce)',
		).matches;

		let width = 0;
		let height = 0;
		let dpr = 1;
		let raf = 0;
		let running = false;
		let color = '255, 255, 255';

		const stars: Star[] = Array.from({ length: STAR_COUNT }, () =>
			spawnStar(true),
		);

		const hexToRgb = (value: string) => {
			const hex = value.replace('#', '').trim();
			if (hex.length !== 6) return null;
			const n = Number.parseInt(hex, 16);
			if (Number.isNaN(n)) return null;
			return `${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}`;
		};

		const readColor = () => {
			const raw = getComputedStyle(canvas)
				.getPropertyValue('--foreground-primary')
				.trim();
			color = hexToRgb(raw) ?? '227, 228, 230';
		};

		const resize = () => {
			const rect = canvas.getBoundingClientRect();
			dpr = Math.min(window.devicePixelRatio || 1, 2);
			width = Math.max(1, Math.floor(rect.width));
			height = Math.max(1, Math.floor(rect.height));
			canvas.width = Math.floor(width * dpr);
			canvas.height = Math.floor(height * dpr);
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
			readColor();
		};

		const project = (star: Star, z: number) => {
			const focal = Math.min(width, height) * 0.55;
			return {
				x: width / 2 + (star.x / z) * focal,
				y: height / 2 + (star.y / z) * focal,
			};
		};

		const drawFrame = (animate: boolean) => {
			ctx.clearRect(0, 0, width, height);

			for (const star of stars) {
				if (animate) {
					star.z -= SPEED * (0.45 + (1 - star.z) * 0.9);
					if (star.z <= 0.03) {
						const next = spawnStar(false);
						star.x = next.x;
						star.y = next.y;
						star.z = next.z;
					}
				}

				const closeness = 1 - star.z;
				const current = project(star, star.z);
				const trailZ = Math.min(1, star.z + 0.055 + closeness * 0.08);
				const prev = project(star, trailZ);
				const alpha = 0.22 + closeness * 0.78;
				const lineWidth = 0.7 + closeness * 2.2;

				ctx.strokeStyle = `rgba(${color}, ${alpha})`;
				ctx.lineWidth = lineWidth;
				ctx.lineCap = 'round';
				ctx.beginPath();
				ctx.moveTo(prev.x, prev.y);
				ctx.lineTo(current.x, current.y);
				ctx.stroke();

				ctx.fillStyle = `rgba(${color}, ${Math.min(1, alpha + 0.1)})`;
				ctx.beginPath();
				ctx.arc(current.x, current.y, 0.35 + closeness * 1.15, 0, Math.PI * 2);
				ctx.fill();
			}
		};

		const tick = () => {
			if (!running) return;
			drawFrame(true);
			raf = window.requestAnimationFrame(tick);
		};

		const start = () => {
			if (running || reduced) return;
			running = true;
			raf = window.requestAnimationFrame(tick);
		};

		const stop = () => {
			running = false;
			window.cancelAnimationFrame(raf);
		};

		resize();
		drawFrame(!reduced);

		const resizeObserver = new ResizeObserver(resize);
		resizeObserver.observe(canvas);

		const visibility = new IntersectionObserver(
			([entry]) => {
				if (reduced) return;
				if (entry?.isIntersecting) start();
				else stop();
			},
			{ threshold: 0.05 },
		);
		visibility.observe(canvas);

		const onTheme = () => readColor();
		const themeObserver = new MutationObserver(onTheme);
		themeObserver.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ['class'],
		});

		return () => {
			stop();
			resizeObserver.disconnect();
			visibility.disconnect();
			themeObserver.disconnect();
		};
	}, []);

	return (
		<canvas
			ref={canvasRef}
			aria-hidden
			className='pointer-events-none absolute inset-0 size-full [mask-image:radial-gradient(ellipse_at_center,black_58%,transparent_96%)] opacity-50'
		/>
	);
};
