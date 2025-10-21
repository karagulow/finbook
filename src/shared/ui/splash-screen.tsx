'use client';

import { useEffect } from 'react';
import iosPWASplash from '../lib/ios-pwa-splash';

export const SplashScreen: React.FC = () => {
	useEffect(() => {
		iosPWASplash('/icons/maskable-icon.png', '#000000');
	}, []);
	return null;
};
