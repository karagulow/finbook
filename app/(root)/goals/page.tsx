import { Metadata } from 'next';
import { GoalsPage } from '@/src/page-views/goals-page';

export const metadata: Metadata = {
	title: 'Цели',
};

export default function Goals() {
	return <GoalsPage />;
}
