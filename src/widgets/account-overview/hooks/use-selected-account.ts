'use client';

import { create } from 'zustand';

interface SelectedAccountState {
	selectedAccountId: string | null;
	setSelectedAccountId: (id: string | null) => void;
}

export const useSelectedAccount = create<SelectedAccountState>(set => ({
	selectedAccountId: 'all',
	setSelectedAccountId: id => set({ selectedAccountId: id }),
}));
