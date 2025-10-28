import { RegistrationForm } from '@/src/widgets/auth';
import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
	title: 'Регистрация',
};

export default function Registration() {
	return <RegistrationForm />;
}
