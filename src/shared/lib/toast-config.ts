import type { ToasterProps } from 'react-hot-toast';

export const toastOptions: ToasterProps['toastOptions'] = {
	className: 'toaster',
	success: {
		style: {
			color: 'var(--success)',
		},
		iconTheme: {
			primary: 'var(--success)',
			secondary: 'var(--button-tertiary)',
		},
	},
	error: {
		style: {
			color: 'var(--wrong)',
		},
		iconTheme: {
			primary: 'var(--wrong)',
			secondary: 'var(--button-tertiary)',
		},
	},
	style: {
		color: 'var(--foreground-secondary)',
		background: 'color-mix(in srgb, var(--button-tertiary) 70%, transparent)',
		backdropFilter: 'blur(12px)',
		border: '0.5px solid var(--border-primary)',
		padding: '10px 14px 10px 10px',
		borderRadius: '12px',
		fontSize: '13px',
		fontWeight: '500',
		marginTop: 'env(safe-area-inset-top)',
		marginBottom: 'env(safe-area-inset-bottom)',
		marginLeft: 'env(safe-area-inset-left)',
		marginRight: 'env(safe-area-inset-right)',
		gap: '10px',
	},
};
