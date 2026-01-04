
import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import { verifyToken } from '@/lib/auth';
import { sendEmail } from '@/lib/email';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
    const cookieStore = await cookies();
    const token = cookieStore.get('token');
    const decoded = token ? verifyToken(token.value) : null;

    if (!decoded || (decoded as any).role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { userId, status } = await req.json(); // status: 'approved' | 'rejected'

    if (!userId || !['approved', 'rejected'].includes(status)) {
        return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    }

    await connectToDatabase();
    const user = await User.findByIdAndUpdate(userId, { status }, { new: true });

    if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Send Email
    const subject = status === 'approved' ? 'Congratulations! Internship Approved' : 'Internship Application Update';
    const html = status === 'approved'
        ? `<h1>Congratulations ${user.name}!</h1><p>Your application for the ${user.domain} internship at GSV Company has been <strong>APPROVED</strong>.</p><p>Please login to your dashboard to view tasks.</p>`
        : `<h1>Hello ${user.name}</h1><p>Thank you for your interest. Unfortunately, your application for the internship has been declined.</p>`;

    await sendEmail(user.email, subject, html);

    return NextResponse.json({ message: `User ${status}`, user });
}
