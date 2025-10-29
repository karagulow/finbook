import { Metadata } from 'next';
import { DebtsPage } from '@/src/page-views/debts-page';

export const metadata: Metadata = {
	title: 'Долги',
};

export default function Debts() {
	return <DebtsPage />;
}
