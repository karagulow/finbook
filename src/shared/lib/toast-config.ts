import type { ToasterProps } from 'react-hot-toast';

export const toastOptions: ToasterProps['toastOptions'] = {
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
		background: 'var(--button-tertiary)',
		border: '0.5px solid var(--border-primary)',
		padding: '10px',
		borderRadius: '6px',
		fontSize: '13px',
		fontWeight: '500',
		marginTop: 'env(safe-area-inset-top)',
		marginBottom: 'env(safe-area-inset-bottom)',
		marginLeft: 'env(safe-area-inset-left)',
		marginRight: 'env(safe-area-inset-right)',
	},
};
