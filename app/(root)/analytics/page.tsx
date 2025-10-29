import { Metadata } from 'next';
import { AnalyticsPage } from '@/src/page-views/analytics-page';

export const metadata: Metadata = {
	title: 'Аналитика',
};

export default function Analytics() {
	return <AnalyticsPage />;
}
