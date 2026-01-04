
import { NextResponse } from 'next/server';
import ExcelJS from 'exceljs';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function GET(req: Request) {
    const cookieStore = await cookies();
    const token = cookieStore.get('token');
    const decoded = token ? verifyToken(token.value) : null;

    if (!decoded || (decoded as any).role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    const students = await User.find({ role: 'student' }).sort({ createdAt: -1 });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Interns');

    worksheet.columns = [
        { header: 'Name', key: 'name', width: 20 },
        { header: 'Email', key: 'email', width: 25 },
        { header: 'Phone', key: 'phone', width: 15 },
        { header: 'College', key: 'college', width: 25 },
        { header: 'Department', key: 'department', width: 15 },
        { header: 'Start Date', key: 'startDate', width: 15 },
        { header: 'End Date', key: 'endDate', width: 15 },
        { header: 'Domain', key: 'domain', width: 20 },
        { header: 'About', key: 'about', width: 40 },
        { header: 'Status', key: 'status', width: 10 },
        { header: 'Registered At', key: 'createdAt', width: 20 },
    ];

    students.forEach((student) => {
        worksheet.addRow({
            name: student.name,
            email: student.email,
            phone: student.phone,
            college: student.college,
            department: student.department,
            startDate: student.startDate,
            endDate: student.endDate,
            domain: student.domain,
            about: student.about,
            status: student.status,
            createdAt: student.createdAt.toISOString().split('T')[0],
        });
    });

    const buffer = await workbook.xlsx.writeBuffer();

    return new NextResponse(buffer, {
        status: 200,
        headers: {
            'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition': 'attachment; filename="interns_data.xlsx"',
        },
    });
}
