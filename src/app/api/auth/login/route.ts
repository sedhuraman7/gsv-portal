
import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import { comparePassword, createToken } from '@/lib/auth';

export async function POST(req: Request) {
    try {
        await connectToDatabase();
        const { email, password, role } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ error: 'Missing credentials' }, { status: 400 });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        // Check role if specified (optional strict check)
        if (role && user.role !== role) {
            return NextResponse.json({ error: 'Unauthorized role' }, { status: 403 });
        }

        const isMatch = await comparePassword(password, user.password!);
        if (!isMatch) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        // Check status for students
        if (user.role === 'student' && user.status === 'rejected') {
            return NextResponse.json({ error: 'Your application has been rejected.' }, { status: 403 });
        }
        // Pending students can login but might see restricted dashboard? 
        // Usually they see "Application Pending" status.

        const token = createToken({
            userId: user._id,
            email: user.email,
            role: user.role,
            name: user.name
        });

        const response = NextResponse.json({
            message: 'Login successful',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                status: user.status
            },
            token
        });

        response.cookies.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 86400, // 1 day
            path: '/',
        });

        return response;

    } catch (error: any) {
        console.error('Login Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
