
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import * as jwt from 'jsonwebtoken';

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const cookieStore = await cookies();
    const token = cookieStore.get('token');

    if (!token) {
        redirect('/login');
    }

    let role: 'admin' | 'student' = 'student';
    try {
        const decoded: any = jwt.decode(token.value);
        if (decoded && decoded.role) {
            role = decoded.role;
        }
    } catch (e) {
        redirect('/login');
    }

    return (
        <div className="dashboard-layout">
            <Sidebar role={role} />
            <main className="main-content">
                {children}
            </main>
        </div>
    );
}
