import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { ImageResponse } from 'next/og';

import { siteConfig } from '@/src/shared/config/site';

export const ogImageSize = {
	width: 1200,
	height: 630,
};

export const ogImageContentType = 'image/png';

type OgVariant = 'public' | 'app';

const copy: Record<
	OgVariant,
	{ alt: string; kicker: string; title: string; description: string }
> = {
	public: {
		alt: 'Финкнижка — начните лучше понимать свои финансы',
		kicker: 'Учёт личных финансов',
		title: 'Начните лучше понимать свои финансы',
		description: 'Счета, доходы, расходы и аналитика в одном месте.',
	},
	app: {
		alt: 'Финкнижка — приложение для учёта личных финансов',
		kicker: 'Личные финансы',
		title: siteConfig.name,
		description:
			'Счета, операции, аналитика, цели и долги — в одном приложении.',
	},
};

async function loadAssets() {
	const fontsDir = path.join(process.cwd(), 'src/shared/assets/fonts');
	const [latin600, cyrillic600, latin500, cyrillic500, icon] =
		await Promise.all([
			readFile(path.join(fontsDir, 'latin-600-normal.woff')),
			readFile(path.join(fontsDir, 'cyrillic-600-normal.woff')),
			readFile(path.join(fontsDir, 'latin-500-normal.woff')),
			readFile(path.join(fontsDir, 'cyrillic-500-normal.woff')),
			readFile(path.join(process.cwd(), 'public/icons/maskable-icon.png')),
		]);

	const font = (
		data: Buffer,
		weight: 500 | 600,
	): {
		name: string;
		data: Buffer;
		weight: 500 | 600;
		style: 'normal';
	} => ({
		name: 'Manrope',
		data,
		weight,
		style: 'normal',
	});

	return {
		iconSrc: `data:image/png;base64,${icon.toString('base64')}`,
		fonts: [
			font(latin600, 600),
			font(cyrillic600, 600),
			font(latin500, 500),
			font(cyrillic500, 500),
		],
	};
}

export function ogAlt(variant: OgVariant) {
	return copy[variant].alt;
}

export async function createOgImage(variant: OgVariant) {
	const { iconSrc, fonts } = await loadAssets();
	const { kicker, title, description } = copy[variant];
	const titleSize = variant === 'public' ? 64 : 88;

	return new ImageResponse(
		(
			<div
				style={{
					width: '100%',
					height: '100%',
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'space-between',
					backgroundColor: '#08090a',
					color: '#e3e4e6',
					padding: '68px 72px',
					fontFamily: 'Manrope',
					position: 'relative',
				}}
			>
				<div
					style={{
						position: 'absolute',
						inset: 0,
						display: 'flex',
						justifyContent: 'space-between',
						padding: '0 36px',
					}}
				>
					{Array.from({ length: 16 }).map((_, index) => (
						<div
							key={index}
							style={{
								width: 1,
								height: '100%',
								backgroundColor: '#1c1e22',
							}}
						/>
					))}
				</div>
				<div
					style={{
						position: 'absolute',
						right: -80,
						bottom: -180,
						width: 520,
						height: 520,
						borderRadius: 520,
						background:
							'radial-gradient(circle, rgba(74,126,224,0.38) 0%, rgba(74,126,224,0) 68%)',
					}}
				/>

				<div
					style={{
						display: 'flex',
						alignItems: 'center',
						gap: 16,
					}}
				>
					<img
						src={iconSrc}
						width={56}
						height={56}
						style={{
							borderRadius: 14,
							border: '1px solid rgba(255,255,255,0.14)',
						}}
					/>
					<div
						style={{
							display: 'flex',
							fontSize: 28,
							fontWeight: 600,
							letterSpacing: -0.6,
						}}
					>
						{siteConfig.name}
					</div>
				</div>

				<div
					style={{
						display: 'flex',
						flexDirection: 'column',
						gap: 22,
						maxWidth: 980,
					}}
				>
					<div
						style={{
							display: 'flex',
							fontSize: 22,
							fontWeight: 500,
							letterSpacing: 0.4,
							color: '#969799',
						}}
					>
						{kicker}
					</div>
					<div
						style={{
							display: 'flex',
							fontSize: titleSize,
							fontWeight: 600,
							lineHeight: 1.05,
							letterSpacing: -2.2,
						}}
					>
						{title}
					</div>
					<div
						style={{
							display: 'flex',
							fontSize: 28,
							fontWeight: 500,
							lineHeight: 1.35,
							color: '#b4b6ba',
							maxWidth: 820,
						}}
					>
						{description}
					</div>
				</div>
			</div>
		),
		{
			...ogImageSize,
			fonts,
		},
	);
}
