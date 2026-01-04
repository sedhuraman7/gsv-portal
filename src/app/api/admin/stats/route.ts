import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers'; // Using this inside route handlers in App Router is tricky if not passed, but we can use request cookies.

export async function GET(req: Request) {
    // Auth Check
    const cookieStore = await cookies();
    const token = cookieStore.get('token');
    const decoded = token ? verifyToken(token.value) : null;
    if (!token || !decoded || (decoded as any).role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();

    const total = await User.countDocuments({ role: 'student' });
    const pending = await User.countDocuments({ role: 'student', status: 'pending' });
    const active = await User.countDocuments({ role: 'student', status: 'approved' });

    return NextResponse.json({ total, pending, active });
}
