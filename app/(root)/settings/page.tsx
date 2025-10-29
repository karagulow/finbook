import { Metadata } from 'next';
import { SettingsPage } from '@/src/page-views/settings-page';

export const metadata: Metadata = {
	title: 'Настройки',
};

export default function Transactions() {
	return <SettingsPage />;
}
