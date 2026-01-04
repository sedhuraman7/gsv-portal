
import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import { hashPassword } from '@/lib/auth';
import { writeFile } from 'fs/promises';
import path from 'path';
import fs from 'fs';
import { sendEmail } from '@/lib/email';

export async function POST(req: Request) {
    try {
        await connectToDatabase();

        const formData = await req.formData();
        const role = formData.get('role') as string;
        const name = formData.get('name') as string;
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        if (!email || !password || !name || !role) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ error: 'User already exists' }, { status: 400 });
        }

        let userData: any = {
            name,
            email,
            password: await hashPassword(password),
            role,
            status: role === 'student' ? 'pending' : undefined,
        };

        if (role === 'admin') {
            const secret = formData.get('adminSecret') as string;
            if (secret !== process.env.ADMIN_SECRET) {
                return NextResponse.json({ error: 'Invalid Admin Secret Code' }, { status: 403 });
            }
        } else {
            // Student
            userData.phone = formData.get('phone');
            userData.college = formData.get('college');
            userData.department = formData.get('department');
            userData.year = formData.get('year');
            userData.domain = formData.get('domain');
            userData.about = formData.get('about');
            userData.startDate = formData.get('startDate');
            userData.endDate = formData.get('endDate');

            // Resume Link instead of File Upload (To fix Netlify EROFS)
            userData.resumeUrl = formData.get('resumeUrl') || '';
        }

        const newUser = await User.create(userData);

        // Send Welcome Email
        if (role === 'student') {
            await sendEmail(
                newUser.email,
                'Registration Successful - GSV Internship',
                `<h1>Welcome ${newUser.name}</h1><p>Your registration is successful. Please wait for admin approval.</p>`
            );
        }

        return NextResponse.json({ message: 'Registration successful', userId: newUser._id }, { status: 201 });

    } catch (error: any) {
        console.error('Registration Error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
