import {
	createOgImage,
	ogAlt,
	ogImageContentType,
	ogImageSize,
} from '@/src/shared/lib/og-image';

export const alt = ogAlt('app');
export const size = ogImageSize;
export const contentType = ogImageContentType;

export default function AuthOpenGraphImage() {
	return createOgImage('app');
}
