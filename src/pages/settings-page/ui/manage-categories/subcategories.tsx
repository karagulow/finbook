import React from 'react';
import {
	Control,
	Controller,
	FieldArrayWithId,
	UseFieldArrayAppend,
	UseFieldArrayRemove,
} from 'react-hook-form';
import { Button, DeleteButton, Input } from '@/src/shared/ui';
import { FormValues } from './create-category-content';

interface Props {
	control: Control<FormValues>;
	fields: FieldArrayWithId<FormValues, 'subcategories', 'id'>[];
	append: UseFieldArrayAppend<FormValues, 'subcategories'>;
	remove: UseFieldArrayRemove;
}

export const Subcategories: React.FC<Props> = ({
	control,
	fields,
	append,
	remove,
}) => {
	return (
		<div className='flex flex-col gap-2.5 w-full'>
			<h3 className='font-bold text-[17px] text-[var(--foreground-primary)]'>
				Подкатегории
			</h3>

			<Button type='button' onClick={() => append({ name: '' })}>
				Добавить подкатегорию
			</Button>

			<ul className='flex flex-col gap-1.5 w-full'>
				{fields.map((field, index) => (
					<li
						key={field.id}
						className='flex flex-row items-center justify-between gap-2.5 px-3.5 py-2 bg-[var(--muted)] rounded-[6px] w-full h-10'
					>
						<Controller
							control={control}
							name={`subcategories.${index}.name`}
							render={({ field }) => (
								<input
									className='font-medium text-[13px] text-[var(--foreground-primary)] placeholder:text-[var(--input-primary-placeholder)] w-full outline-none bg-transparent'
									type='text'
									placeholder='Введите название подкатегории'
									{...field}
								/>
							)}
						/>
						<DeleteButton onClick={() => remove(index)} />
					</li>
				))}
			</ul>
		</div>
	);
};
