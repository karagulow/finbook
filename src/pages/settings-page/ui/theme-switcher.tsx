'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Select } from '@/src/shared/ui';
import { Option } from '@/src/shared/ui/select';

const themeOptions: Option[] = [
	{ value: 'light', label: 'Светлая' },
	{ value: 'dark', label: 'Тёмная' },
	{ value: 'system', label: 'Системная' },
];

export default function ThemeSwitcher() {
	const { theme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => setMounted(true), []);
	if (!mounted) return null;

	return (
		<div className='w-full sm:w-[150px]'>
			<Select
				options={themeOptions}
				value={theme}
				onChange={val => setTheme(val)}
			/>
		</div>
	);
}
