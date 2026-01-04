
import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import mongoose from 'mongoose';

export async function GET() {
    try {
        await connectToDatabase();
        if (mongoose.connection.readyState === 1) {
            return NextResponse.json({ status: 'ok', dbState: 'connected' });
        } else {
            return NextResponse.json({ status: 'error', message: 'DB not ready' }, { status: 503 });
        }
    } catch (error: any) {
        return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
    }
}
