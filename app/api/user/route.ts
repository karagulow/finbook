import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verify } from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET!;

export async function GET(req: NextRequest) {
	try {
		const token = req.cookies.get('authToken')?.value;
		if (!token) {
			return NextResponse.json({ message: 'Не авторизован' }, { status: 401 });
		}

		const decoded = verify(token, JWT_SECRET) as { userId: string };

		const fullUser = await prisma.user.findUnique({
			where: { id: decoded.userId },
			select: {
				id: true,
				email: true,
				currency: {
					select: {
						id: true,
						name: true,
						code: true,
						symbol: true,
					},
				},
				createdAt: true,
				updatedAt: true,
			},
		});

		if (!fullUser) {
			return NextResponse.json({ error: 'User not found' }, { status: 404 });
		}

		return NextResponse.json(fullUser);
	} catch (error: any) {
		console.error(error);
		return NextResponse.json({ error: error.message }, { status: 400 });
	}
}
