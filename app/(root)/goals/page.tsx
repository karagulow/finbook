import { Metadata } from 'next';
import { GoalsPage } from '@/src/pages/goals-page';

export const metadata: Metadata = {
	title: 'Цели',
};

export default function Goals() {
	return <GoalsPage />;
}
