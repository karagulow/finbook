import { Metadata } from 'next';
import { TransactionsPage } from '@/src/page-views/transactions-page';

export const metadata: Metadata = {
	title: 'Транзакции',
};

export default function Transactions() {
	return <TransactionsPage />;
}
