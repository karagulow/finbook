import { Metadata } from 'next';
import { MorePage } from '@/src/page-views/more-page';

export const metadata: Metadata = {
	title: 'Ещё',
};

export default function More() {
	return <MorePage />;
}
