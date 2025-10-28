import { Metadata } from 'next';
import { MorePage } from '@/src/pages/more-page';

export const metadata: Metadata = {
	title: 'Ещё',
};

export default function More() {
	return <MorePage />;
}
