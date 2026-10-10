import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { ImageResponse } from 'next/og';

import { siteConfig } from '@/src/shared/config/site';

export const ogImageSize = {
	width: 1200,
	height: 630,
};

export const ogImageContentType = 'image/png';

const ogCopy = {
	alt: 'Финкнижка — начните лучше понимать свои финансы',
	title: ['Начните лучше понимать', 'свои финансы.'],
};

async function loadAssets() {
	const fontsDir = path.join(process.cwd(), 'src/shared/assets/fonts');
	const [medium, semiBold, icon] = await Promise.all([
		readFile(path.join(fontsDir, 'Manrope-Medium.ttf')),
		readFile(path.join(fontsDir, 'Manrope-SemiBold.ttf')),
		readFile(path.join(process.cwd(), 'public/icons/icon-192x192.png')),
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
		fonts: [font(medium, 500), font(semiBold, 600)],
	};
}

export function ogAlt() {
	return ogCopy.alt;
}

export async function createOgImage() {
	const { iconSrc, fonts } = await loadAssets();

	return new ImageResponse(
		(
			<div
				style={{
					width: '100%',
					height: '100%',
					display: 'flex',
					flexDirection: 'column',
					backgroundColor: '#f7f7f7',
					padding: '118px 88px',
					fontFamily: 'Manrope',
				}}
			>
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
					}}
				>
					<img
						src={iconSrc}
						width={44}
						height={44}
						style={{ borderRadius: 12 }}
					/>
					<div
						style={{
							display: 'flex',
							marginLeft: 16,
							fontSize: 28,
							fontWeight: 500,
							letterSpacing: -0.4,
							color: '#6f6f6f',
						}}
					>
						{siteConfig.name}
					</div>
				</div>

				<div
					style={{
						display: 'flex',
						flexDirection: 'column',
						marginTop: 40,
					}}
				>
					{ogCopy.title.map(line => (
						<div
							key={line}
							style={{
								display: 'flex',
								fontSize: 68,
								fontWeight: 600,
								lineHeight: 1.12,
								letterSpacing: -2.4,
								color: '#111111',
							}}
						>
							{line}
						</div>
					))}
				</div>
			</div>
		),
		{
			...ogImageSize,
			fonts,
		},
	);
}
