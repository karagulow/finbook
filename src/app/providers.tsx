'use client';

import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'react-hot-toast';

import { toastOptions } from '../shared/lib';

export default function Providers({ children }: { children: React.ReactNode }) {
	const [queryClient] = useState(() => new QueryClient());

	return (
		<ThemeProvider attribute='class' defaultTheme='system' enableSystem={true}>
			<QueryClientProvider client={queryClient}>
				{children}
				<Toaster toastOptions={toastOptions} />
			</QueryClientProvider>
		</ThemeProvider>
	);
}
