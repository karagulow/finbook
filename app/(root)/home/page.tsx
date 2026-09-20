import { Metadata } from 'next';
import { HomePage } from '@/src/page-views/home-page';

export const metadata: Metadata = {
	title: 'Главная',
};

export default function Home() {
	return <HomePage />;
}
