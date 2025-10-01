import { Metadata } from 'next';
import { TransactionsPage } from '@/src/pages/transactions-page';

export const metadata: Metadata = {
	title: 'Транзакции',
};

export default function Transactions() {
	return <TransactionsPage />;
}
