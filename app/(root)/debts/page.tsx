import { Metadata } from 'next';
import { DebtsPage } from '@/src/pages/debts-page';

export const metadata: Metadata = {
	title: 'Долги',
};

export default function Debts() {
	return <DebtsPage />;
}
