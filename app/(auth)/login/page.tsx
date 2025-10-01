import { LoginForm } from '@/src/widgets/auth';
import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
	title: 'Авторизация',
};

export default function Login() {
	return <LoginForm />;
}
