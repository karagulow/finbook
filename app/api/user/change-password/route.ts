import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { PrismaClient } from '@prisma/client';
import { verify } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(req: NextRequest) {
	try {
		const cookieStore = await cookies();
		const token = cookieStore.get('authToken')?.value;

		if (!token) {
			return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
		}

		const decoded = verify(token, JWT_SECRET) as { userId: string };
		const userId = decoded.userId;

		const { currentPassword, newPassword } = await req.json();

		if (!currentPassword || !newPassword) {
			return NextResponse.json(
				{ error: 'Текущий и новый пароль обязательны' },
				{ status: 400 }
			);
		}

		const user = await prisma.user.findUnique({ where: { id: userId } });
		if (!user) {
			return NextResponse.json(
				{ error: 'Пользователь не найден' },
				{ status: 404 }
			);
		}

		const isValid = await bcrypt.compare(currentPassword, user.password);
		if (!isValid) {
			return NextResponse.json(
				{ error: 'Текущий пароль неверен' },
				{ status: 401 }
			);
		}

		const hashedPassword = await bcrypt.hash(newPassword, 10);

		await prisma.user.update({
			where: { id: userId },
			data: { password: hashedPassword },
		});

		return NextResponse.json({ message: 'Пароль успешно изменён' });
	} catch (error) {
		if (error instanceof Error) {
			console.error(error);
			return NextResponse.json({ error: error.message }, { status: 400 });
		}

		console.error('Неизвестная ошибка', error);
		return NextResponse.json({ error: 'Неизвестная ошибка' }, { status: 500 });
	}
}
