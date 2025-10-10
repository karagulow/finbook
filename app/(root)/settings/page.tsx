import { Metadata } from 'next';
import { SettingsPage } from '@/src/pages/settings-page';

export const metadata: Metadata = {
	title: 'Настройки',
};

export default function Transactions() {
	return <SettingsPage />;
}
