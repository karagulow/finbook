import { Metadata } from 'next';
import { HomePage } from '@/src/pages/home-page';

export const metadata: Metadata = {
	title: 'Главная',
};

export default function Home() {
	return <HomePage />;
}
