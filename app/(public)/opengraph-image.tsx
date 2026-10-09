import {
	createOgImage,
	ogAlt,
	ogImageContentType,
	ogImageSize,
} from '@/src/shared/lib/og-image';

export const alt = ogAlt('public');
export const size = ogImageSize;
export const contentType = ogImageContentType;

export default function PublicOpenGraphImage() {
	return createOgImage('public');
}
