'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Resolver, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useQueryClient } from '@tanstack/react-query';

import { api, toastOptions } from '@/src/shared/lib';
import {
	TransactionFormData,
	transactionValidation,
} from '../model/validations';
import { Account, Category, Subcategory, Transaction } from '../model/types';

export const useTransactionForm = (
	type: 'INCOME' | 'EXPENSE',
	onClose: () => void,
	transaction: Transaction
) => {
	const [loading, setLoading] = useState(false);
	const [accounts, setAccounts] = useState<Account[]>([]);
	const [categories, setCategories] = useState<Category[]>([]);
	const [subcategories, setSubcategories] = useState<Subcategory[]>([]);

	const queryClient = useQueryClient();

	const form = useForm<TransactionFormData>({
		resolver: yupResolver(
			transactionValidation
		) as Resolver<TransactionFormData>,
		defaultValues: {
			amount: transaction.amount,
			date: new Date(transaction.date),
			accountId: transaction.account?.id,
			categoryId: transaction.category?.id,
			subcategoryId: transaction.subcategory?.id,
			description: transaction.description,
		},
	});

	const {
		register,
		handleSubmit,
		setValue,
		watch,
		formState: { errors },
	} = form;

	const selectedCategoryId = watch('categoryId');

	useEffect(() => {
		const fetchData = async () => {
			try {
				const [accountsRes, categoriesRes] = await Promise.all([
					api.get('/api/accounts'),
					api.get('/api/categories'),
				]);
				setAccounts(accountsRes.data);
				setCategories(categoriesRes.data);
			} catch (error) {
				console.error(error);
			}
		};
		fetchData();
	}, []);

	useEffect(() => {
		const category = categories.find(c => c.id === selectedCategoryId);
		setSubcategories(category ? category.subcategories : []);
	}, [selectedCategoryId, categories]);

	const onSubmit = async (data: TransactionFormData) => {
		if (!navigator.onLine) {
			toast.error('Нет соединения с интернетом', toastOptions);
			return;
		}

		setLoading(true);
		try {
			await api.put(`/api/transactions/${transaction.id}`, {
				...data,
				type,
			});
			queryClient.invalidateQueries({ queryKey: ['transactions'] });
			toast.success('Транзакция обновлена!', toastOptions);
			onClose();
		} catch (error: unknown) {
			let message = 'Ошибка при обновлении транзакции';

			if (axios.isAxiosError(error)) {
				message = error.response?.data?.message || error.message || message;
			} else if (error instanceof Error) {
				message = error.message;
			}

			toast.error(message, toastOptions);
		} finally {
			setLoading(false);
		}
	};

	return {
		register,
		handleSubmit,
		setValue,
		watch,
		errors,
		onSubmit,
		loading,
		accounts,
		categories,
		subcategories,
	};
};
